import { Stack, StackProps, Tags } from "aws-cdk-lib";
import * as event from "aws-cdk-lib/aws-events";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import { DeploymentEnvironmentAware } from "./utility/deployment-environment";

export type CommandBusAware = {
    commandBusStack: CommandBusStack;
};

export class CommandBusStack extends Stack {
    private props: StackProps & DeploymentEnvironmentAware;
    public readonly bus: event.EventBus;

    constructor(
        scope: Construct,
        id: string,
        props: StackProps & DeploymentEnvironmentAware,
    ) {
        super(scope, id, props);
        this.props = props;

        // Create a bus as a public property, to be consumed by other stacks.
        this.bus = new event.EventBus(this, "tracking-poker-command-bus", {
            eventBusName: "tracking-poker-command-bus",
        });

        this.logAllCommands();

        Tags.of(this).add("ServiceName", "CommandBus");
    }

    logAllCommands() {
        const logGroup = new logs.LogGroup(
            this,
            "tracking-poker-command-bus-logs",
            {
                logGroupName: "tracking-poker-command-bus-logs",
            },
        );
        new event.Rule(this, `tracking-poker-command-bus-logs-rule`, {
            ruleName: `tracking-poker-command-bus-logs-rule`,
            eventBus: this.bus,
            eventPattern: {
                // Work around to capture all events.
                source: [{ prefix: "" }] as any[],
            },
            targets: [new eventTargets.CloudWatchLogGroup(logGroup)],
        });
    }
}
