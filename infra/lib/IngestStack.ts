import { Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamo from "aws-cdk-lib/aws-dynamodb";
import { BillingMode } from "aws-cdk-lib/aws-dynamodb";
import * as secrets from "aws-cdk-lib/aws-secretsmanager";
import * as path from "path";
import { EventBusAware } from "./EventBusStack";
import { createProjectionHandlerLambda } from "./utility/projection";
import { stringAttribute } from "./utility/dynamo";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Architecture, Tracing } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib/core";
import { bundlingVolumesWithCommon } from "./utility/bundling";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { addPutEventsPolicies } from "./utility/eventBridge";
import { CommandBusAware } from "./CommandBusStack";
import * as event from "aws-cdk-lib/aws-events";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";
import { allowTraces } from "./utility/xray";

type IngestStackProps = StackProps & EventBusAware & CommandBusAware;

export class IngestStack extends Stack {
    private props: IngestStackProps;
    private readonly resolveService: (input: string) => string;

    constructor(scope: Construct, id: string, props: IngestStackProps) {
        super(scope, id, props);
        this.props = props;

        this.resolveService = (input: string) => path.resolve(__dirname, "../../ingest", input);

        this.createDynamoTable();
        this.createProjectionHandlerLambda();
        this.createScheduledIngestLambda();

        Tags.of(this).add("ServiceName", "Ingest");
    }

    createProjectionHandlerLambda() {
        createProjectionHandlerLambda(
            this,
            "ingest",
            this.resolveService("src/projection/handler.ts"),
            this.resolveService("package-lock.json"),
            this.resolveService(""),
            this.props.eventBusStack.bus,
        );
    }

    createScheduledIngestLambda() {
        const apiKey = new secrets.Secret(this, `youtube-api-key`, {
            secretName: `youtube-api-key`,
        });
        const ingestLambda = new lambdaNodejs.NodejsFunction(this, "ingest-scheduled-lambda", {
            runtime: lambda.Runtime.NODEJS_20_X,
            architecture: Architecture.ARM_64,
            timeout: Duration.minutes(2),
            memorySize: 128,
            tracing: Tracing.ACTIVE,
            environment: {
                // Keys generated at: https://console.cloud.google.com/apis/credentials?project=XXX
                YOUTUBE_API_KEY: apiKey.secretValue.unsafeUnwrap(),
                COMMAND_BUS_ARN: this.props.commandBusStack.bus.eventBusArn,
                EVENT_BUS_BUS_ARN: this.props.eventBusStack.bus.eventBusArn,
            },
            entry: this.resolveService("src/index.ts"),
            depsLockFilePath: this.resolveService("package-lock.json"),
            projectRoot: this.resolveService(""),
            bundling: bundlingVolumesWithCommon,
        });
        allowTraces(ingestLambda);

        ingestLambda.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"));
        addPutEventsPolicies(this, "ingest-lambda", ingestLambda.role!, this.props.eventBusStack.bus, this.props.commandBusStack.bus);

        // Check for new streams every hour.
        new event.Rule(this, "hourly-trigger", {
            schedule: event.Schedule.cron({ minute: "5" }),
            targets: [
                new eventTargets.LambdaFunction(ingestLambda, {
                    event: event.RuleTargetInput.fromObject({
                        "detail-type": "CheckForNewStreams",
                    }),
                }),
            ],
        });

        // Slowly ingest the full legacy corpus over time.
        new event.Rule(this, "legacy-ingest-trigger", {
            schedule: event.Schedule.cron({ minute: "0/2" }),
            targets: [
                new eventTargets.LambdaFunction(ingestLambda, {
                    event: event.RuleTargetInput.fromObject({
                        "detail-type": "IngestLegacyStream",
                    }),
                }),
            ],
        });
    }

    createDynamoTable() {
        new dynamo.Table(this, `ingest-log`, {
            tableName: "ingest-log",
            partitionKey: stringAttribute("pk"),
            sortKey: stringAttribute("sk"),
            billingMode: BillingMode.PAY_PER_REQUEST,
        });
    }
}
