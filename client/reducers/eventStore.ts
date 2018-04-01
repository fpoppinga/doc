import { CommandDto } from "../../lib/command";
import { createEvent, EventDto } from "../../lib/event";
import { Doc } from "../../lib/doc";
import { aggregate } from "../../lib/aggregator";

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

    update(event: EventDto) {
        if (this.appliedEvents.find(e => e.id === event.id)) {
            return;
        }

        this._optimisticEvents = this._optimisticEvents.filter(
            c => c.id !== event.id
        );
        this.appliedEvents.push(event);
    }

    get optimisticEvents(): CommandDto[] {
        return this._optimisticEvents;
    }
}
