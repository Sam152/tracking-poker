import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

export function putEvents(busName: string, eventName: string, payload: any) {
    console.log(`Dispatching event to bus ${busName}`, eventName, payload);
    const client = new EventBridgeClient();
    return client.send(
        new PutEventsCommand({
            Entries: [
                {
                    Source: "tracking-poker",
                    DetailType: eventName,
                    Detail: JSON.stringify(payload),
                    EventBusName: busName,
                },
            ],
        }),
    );
}
