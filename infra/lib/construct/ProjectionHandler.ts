import { Construct } from "constructs";
import * as event from "aws-cdk-lib/aws-events";
import { EventBus } from "aws-cdk-lib/aws-events";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Architecture, Tracing } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib/core";
import { bundlingVolumesWithCommon } from "../utility/bundling";
import { allowTraces } from "../utility/xray";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";

type ProjectionHandlerProps = {
    entry: string;
    depsLockFilePath: string;
    projectRoot: string;
    eventBus: EventBus;
};

export class ProjectionHandler extends Construct {
    private readonly id: string;

    constructor(scope: Construct, id: string, props: ProjectionHandlerProps) {
        super(scope, id);
        this.id = id;

        const projectionLambda = new lambdaNodejs.NodejsFunction(this, `lambda`, {
            runtime: lambda.Runtime.NODEJS_20_X,
            architecture: Architecture.ARM_64,
            timeout: Duration.seconds(20),
            memorySize: 128,
            tracing: Tracing.ACTIVE,
            environment: {},
            entry: props.entry,
            depsLockFilePath: props.depsLockFilePath,
            projectRoot: props.projectRoot,
            bundling: bundlingVolumesWithCommon,
        });

        allowTraces(projectionLambda);
        projectionLambda.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"));

        new event.Rule(this, `project-all-events-rule`, {
            ruleName: `${this.id}-projection-invoke-on-all-events`,
            eventBus: props.eventBus,
            // Work around to include all events dispatched on the bus.
            eventPattern: {
                source: [{ prefix: "" }] as any[],
            },
            targets: [new eventTargets.LambdaFunction(projectionLambda)],
        });
    }
}
