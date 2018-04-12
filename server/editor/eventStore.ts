import { EventDto } from "../../lib/event";
import { CommandDto } from "../../lib/command";

export interface EventStore {
    push(command: CommandDto): Promise<EventDto>;
    clear(): Promise<void>;
    getAll(): Promise<EventDto[]>;
    getSince(id: string): Promise<EventDto[]>;
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

    async getSince(id: string): Promise<EventDto[]> {
        const from = this.memory.findIndex(e => e.id === id);

        if (from < 0) {
            return Promise.resolve([]);
        }

        return Promise.resolve(this.memory.slice(from + 1));
    }
}
