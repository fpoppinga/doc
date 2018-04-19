import { CommandDto } from "../../lib/command";
import { createEvent, EventDto } from "../../lib/event";
import { Doc } from "../../lib/doc";
import { aggregate } from "../../lib/aggregator";

export class StateTooOldError implements Error {
    constructor(readonly lastEvent: number) {
        this.name = "StateTooOldError";
        this.message = `State is too old. Last event sequence: ${lastEvent}.`;
    }

    name: string;
    message: string;
}

export class EventStore {
    constructor(
        readonly appliedEvents: EventDto[],
        private _optimisticEvents: CommandDto[] = []
    ) {}

    get state(): Doc {
        const sortedEvents = this.appliedEvents
            .sort((a, b) => a.sequence - b.sequence)
            .map(createEvent);

        const initialState = new Doc("", new Map());

        return aggregate(initialState, sortedEvents);
    }

    get optimisticState(): Doc {
        return aggregate(this.state, this._optimisticEvents.map(createEvent));
    }

    optimisticUpdate(command: CommandDto) {
        this._optimisticEvents.push(command);
    }

    removeOptimisticEvent(command: CommandDto) {
        this._optimisticEvents = this._optimisticEvents.filter(
            existingCmd => existingCmd.id !== command.id
        );
    }

    update(event: EventDto) {
        if (this.appliedEvents.find(e => e.id === event.id)) {
            return;
        }

        const lastEvent = this.appliedEvents.length > 0 ? this.appliedEvents[this.appliedEvents.length - 1].sequence : 0;
        if (event.sequence !== lastEvent + 1) {
            return;
        }

        this.removeOptimisticEvent(event);
        this.appliedEvents.push(event);
    }

    merge(events: EventDto[]) {
        for (const event of events) {
            this.update(event);
        }
    }

    get optimisticEvents(): CommandDto[] {
        return this._optimisticEvents;
    }
}
