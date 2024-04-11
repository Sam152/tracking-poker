import { Stack, StackProps, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib/core";
import { CommandBusAware } from "./CommandBusStack";
import { putEventsPolicy } from "./utility/eventBridge";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as event from "aws-cdk-lib/aws-events";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";

type PipelineStackProps = StackProps & CommandBusAware;

export class PipelineStack extends Stack {
    private props: PipelineStackProps;
    private readonly resolveService: (input: string) => string;

    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);
        this.props = props;

        this.resolveService = (input: string) => path.resolve(__dirname, "../../pipeline", input);

        this.createLambda();
        Tags.of(this).add("ServiceName", "Pipeline");
    }

    createLambda() {
        const pipeline = new lambdaNodejs.NodejsFunction(this, "pipeline-lambda", {
            runtime: lambda.Runtime.NODEJS_20_X,
            architecture: Architecture.ARM_64,
            timeout: Duration.seconds(20),
            memorySize: 128,
            environment: {
                COMMAND_BUS_ARN: this.props.commandBusStack.bus.eventBusArn,
            },
            entry: this.resolveService("src/index.ts"),
            depsLockFilePath: this.resolveService("package-lock.json"),
            projectRoot: this.resolveService(""),
            bundling: {
                volumes: [
                    {
                        // The common directory must be mounted, to be discoverable by npm inside the container.
                        hostPath: path.resolve(__dirname, "../../common"),
                        containerPath: "/common",
                    },
                ],
            },
        });

        const lambdaRole = pipeline.role!;

        // Allow the pipeline to dispatch commands.
        lambdaRole.attachInlinePolicy(putEventsPolicy(this, `pipeline-put-command-bus-policy`, this.props.commandBusStack.bus));

        // Invoke the pipeline when any activity occurs on the command bus.
        new event.Rule(this, "pipeline-invoke-on-all-events", {
            ruleName: "pipeline-invoke-on-all-events",
            eventBus: this.props.commandBusStack.bus,
            // Work around to include all events dispatched on the bus.
            eventPattern: {
                source: [{ prefix: "" }] as any[],
            },
            targets: [new eventTargets.LambdaFunction(pipeline)],
        });
    }
}
