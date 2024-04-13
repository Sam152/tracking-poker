import { Stack, StackProps, Tags } from "aws-cdk-lib";
import * as event from "aws-cdk-lib/aws-events";
import * as eventTargets from "aws-cdk-lib/aws-events-targets";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export type EventBusAware = {
    eventBusStack: EventBusStack;
};

export class EventBusStack extends Stack {
    private props: StackProps;
    public readonly bus: event.EventBus;

    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
        this.props = props;

        // Create a bus as a public property, to be consumed by other stacks.
        this.bus = new event.EventBus(this, "tracking-poker-event-bus", {
            eventBusName: "tracking-poker-event-bus",
        });

        this.logAllCommands();
        this.createEventArchive();

        Tags.of(this).add("ServiceName", "EventBus");
    }

    createEventArchive() {
        new event.Archive(this, `tracking-poker-event-bus-archive`, {
            archiveName: `tracking-poker-event-bus-archive`,
            eventPattern: {
                source: [{ prefix: "" }] as any[],
            },
            sourceEventBus: this.bus,
        });
    }

    logAllCommands() {
        const logGroup = new logs.LogGroup(this, "tracking-poker-event-bus-logs", {
            logGroupName: "tracking-poker-event-bus-logs",
        });
        new event.Rule(this, `tracking-poker-event-bus-logs-rule`, {
            ruleName: `tracking-poker-event-bus-logs-rule`,
            eventBus: this.bus,
            eventPattern: {
                // Work around to capture all events.
                source: [{ prefix: "" }] as any[],
            },
            targets: [new eventTargets.CloudWatchLogGroup(logGroup)],
        });
    }
}
