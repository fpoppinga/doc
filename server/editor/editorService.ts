import { EventStore } from "./eventStore";
import { CommandDto } from "../../lib/command";
import { isValid } from "./validator";
import { EventDto } from "../../lib/event";
import {MessagingService} from './messagingService';

export class InvalidCommandError extends Error {
    constructor(command: CommandDto) {
        super(`Invalid Command: ${command ? command.id : "[unknown id]"}`);
    }
}

export class EditorService {
    constructor(private store: EventStore, private messagingService: MessagingService) {}

    async consume(command: CommandDto) {
        if (!isValid(command)) {
            throw new InvalidCommandError(command);
        }

        const event = await this.store.push(command);
        this.publish(event).catch(console.error);
    }

    async publish(event: EventDto) {
        return this.messagingService.publish(event);
    }
}
