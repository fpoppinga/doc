import { Doc } from "../../lib/doc";
import { CommandDto, TypeCommand } from "../../lib/command";
import v4 = require("uuid/v4");
import { EventStore, StateTooOldError } from "./eventStore";
import { EventDto } from "../../lib/event";
import { Action } from "redux";
import { CommandAction, FetchEventsAction } from "../actions/documentActions";
import { EditorClient } from "../api/editorClient";
import { EventAction } from "../actions/eventActions";

export interface EditorState {
    readonly cursor: string;
    readonly appliedEvents: EventDto[];
    readonly optimisticEvents: CommandDto[];
    readonly doc: Doc;
}

const cursorId = v4();

const initialState: EditorState = {
    cursor: cursorId,
    appliedEvents: [],
    optimisticEvents: [],
    doc: new EventStore([]).state
};

export function editorReducer(
    state: EditorState = initialState,
    action: Action
): EditorState {
    const eventStore = new EventStore(
        state.appliedEvents,
        state.optimisticEvents
    );

    switch (action.type) {
        case "COMMAND":
            const commandAction = action as CommandAction;

            switch (commandAction.state) {
                case "OPTIMISTIC":
                    eventStore.optimisticUpdate(commandAction.payload);
                    break;
                case "REJECTED":
                    eventStore.removeOptimisticEvent(commandAction.payload);
                    break;
            }

            return {
                ...state,
                appliedEvents: eventStore.appliedEvents,
                optimisticEvents: eventStore.optimisticEvents,
                doc: eventStore.optimisticState
            };
        case "EVENT":
            const eventAction = action as EventAction;
            eventStore.update(eventAction.payload);

            return {
                ...state,
                appliedEvents: eventStore.appliedEvents,
                optimisticEvents: eventStore.optimisticEvents,
                doc: eventStore.optimisticState
            };
        case "FETCH_EVENTS":
            const fetchAction = action as FetchEventsAction;
            eventStore.merge(fetchAction.payload.events);

            return {
                ...state,
                appliedEvents: eventStore.appliedEvents,
                optimisticEvents: eventStore.optimisticEvents,
                doc: eventStore.optimisticState
            };
        default:
            return state;
    }
}
