import io from "socket.io-client"
import {Store} from 'redux';
import {RootState} from '../reducers';
import {EventDto} from '../../lib/event';
import {eventAction} from '../actions/eventActions';
import {fetchEventsAction} from '../actions/documentActions';

export class EditorSocket {
    constructor(private store: Store<RootState>, uri: string = "http://localhost:8081") {
        const socket = io(uri).connect();
        socket.on("event", this.handleEvent.bind(this));
    }

    handleEvent(payload: string) {
        const event: EventDto = JSON.parse(payload);

        const appliedEvents = this.store.getState().editor.appliedEvents;
        const lastEvent = appliedEvents.length > 0 ? appliedEvents[appliedEvents.length - 1].sequence : 0

        if (event.sequence > lastEvent + 1) {
            this.store.dispatch(fetchEventsAction(lastEvent));
            return;
        }

        this.store.dispatch(eventAction(event));
    }
}
