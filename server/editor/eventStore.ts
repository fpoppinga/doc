import { EventDto } from "../../lib/event";
import { CommandDto } from "../../lib/command";

export interface EventStore {
    push(command: CommandDto): Promise<EventDto>;
    clear(): Promise<void>;
    getAll(): Promise<EventDto[]>;
    getSince(sequence: number): Promise<EventDto[]>;
}

export class InMemoryEventStore implements EventStore {
    private memory: EventDto[] = [];

    push(command: CommandDto): Promise<EventDto> {
        const eventDto: EventDto = { ...command, sequence: this.memory.length };
        this.memory.push(eventDto);
        return Promise.resolve(eventDto);
    }

    clear(): Promise<void> {
        this.memory = [];
        return Promise.resolve();
    }

    getAll(): Promise<EventDto[]> {
        return Promise.resolve(this.memory);
    }

    getSince(sequence: number): Promise<EventDto[]> {
        return Promise.resolve(this.memory.slice(sequence + 1));
    }
}
