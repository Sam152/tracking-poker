import * as event from "aws-cdk-lib/aws-events";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";
import {Stack} from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

export function invokeLambdaOnEventDetail(
    stack: Stack,
    ruleName: string,
    bus: event.EventBus,
    lambda: lambda.IFunction,
    detailType: string[],
) {
    new event.Rule(stack, ruleName, {
        ruleName: ruleName,
        eventBus: bus,
        eventPattern: {
            detailType: detailType
        },
        targets: [
            new eventTargets.LambdaFunction(lambda),
        ],
    });
}
