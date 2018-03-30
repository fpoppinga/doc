import { Command } from "./command";
import { Doc } from "./doc";

export function aggregate(state: Doc, incoming: Command[]): Doc {
    return new Doc("", new Map());
}
