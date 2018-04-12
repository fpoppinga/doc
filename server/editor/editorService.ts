import { EventStore } from "./eventStore";
import { CommandDto } from "../../lib/command";
import { isValid } from "./validator";
import { EventDto } from "../../lib/event";

export class InvalidCommandError extends Error {
    constructor(command: CommandDto) {
        super(`Invalid Command: ${command ? command.id : "[unknown id]"}`);
    }
}

export class EditorService {
    constructor(private store: EventStore) {}

    async consume(command: CommandDto) {
        if (!isValid(command)) {
            throw new InvalidCommandError(command);
        }

        const event = await this.store.push(command);
        this.publish(event).catch(console.error);
    }

    async publish(event: EventDto) {
        // TODO(FP): implement
        return Promise.resolve();
    }
}
