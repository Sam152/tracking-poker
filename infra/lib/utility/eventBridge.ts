import * as event from "aws-cdk-lib/aws-events";
import { EventBus } from "aws-cdk-lib/aws-events";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";
import { Stack } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";

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
            detailType: detailType,
        },
        targets: [new eventTargets.LambdaFunction(lambda)],
    });
}

export function putEventsPolicy(stack: Stack, policyName: string, bus: EventBus): iam.Policy {
    return new iam.Policy(stack, policyName, {
        policyName: policyName,
        document: new iam.PolicyDocument({
            statements: [
                new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: ["events:PutEvents"],
                    resources: [bus.eventBusArn],
                }),
            ],
        }),
    });
}

/**
 * Add all the policies to a role, required for pushing into the given event bus and command bus.
 */
export function addPutEventsPolicies(stack: Stack, name: string, role: iam.IRole, eventBus: EventBus, commandBus: EventBus) {
    role.attachInlinePolicy(putEventsPolicy(stack, `${name}-put-event-bus-policy`, eventBus));
    role.attachInlinePolicy(putEventsPolicy(stack, `${name}-put-command-bus-policy`, commandBus));
}
