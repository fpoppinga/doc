import { Doc } from "./doc";
import { Event } from "./event";
import { Command } from "./command";

export function aggregate(state: Doc, events: Event<Command>[]): Doc {
    return events.reduce((doc, event) => event.apply(doc), state);
}
