import { Stack } from "aws-cdk-lib";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Architecture, Tracing } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib/core";
import { bundlingVolumesWithCommon } from "./bundling";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import * as event from "aws-cdk-lib/aws-events";
import { EventBus } from "aws-cdk-lib/aws-events";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";
import { allowTraces } from "./xray";

export function createProjectionHandlerLambda(
    stack: Stack,
    name: string,
    entry: string,
    depsLockFilePath: string,
    projectRoot: string,
    eventBus: EventBus,
) {
    const projectionHandler = new lambdaNodejs.NodejsFunction(stack, `${name}-projection-handler-lambda`, {
        runtime: lambda.Runtime.NODEJS_20_X,
        architecture: Architecture.ARM_64,
        timeout: Duration.seconds(20),
        memorySize: 128,
        tracing: Tracing.ACTIVE,
        environment: {},
        entry: entry,
        depsLockFilePath: depsLockFilePath,
        projectRoot: projectRoot,
        bundling: bundlingVolumesWithCommon,
    });
    allowTraces(projectionHandler);

    projectionHandler.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"));

    new event.Rule(stack, `${name}-projection-invoke-on-all-events`, {
        ruleName: `${name}-invoke-on-all-events`,
        eventBus: eventBus,
        // Work around to include all events dispatched on the bus.
        eventPattern: {
            source: [{ prefix: "" }] as any[],
        },
        targets: [new eventTargets.LambdaFunction(projectionHandler)],
    });
}
