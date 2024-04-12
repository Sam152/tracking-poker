import { BusEvents } from "./recordThat";

/**
 * Conditional that narrows event types according to a passed eventName.
 */
export function eventIs<TEventName extends keyof BusEvents, TCheckFor extends keyof BusEvents>(
    checkFor: TCheckFor,
    eventName: TEventName,
    event: BusEvents[TEventName],
): event is TCheckFor extends TEventName ? (TEventName extends TCheckFor ? BusEvents[TCheckFor] : never) : never {
    return (checkFor as string) === eventName;
}
