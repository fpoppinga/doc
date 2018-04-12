import { Doc } from "../../lib/doc";
import { CommandDto, TypeCommand } from "../../lib/command";
import v4 = require("uuid/v4");
import { EventStore } from "./eventStore";
import { EventDto } from "../../lib/event";
import { Action } from "redux";
import { CommandAction } from "../actions/documentActions";
import { EditorClient } from "../api/editorClient";

export interface EditorState {
    readonly cursor: string;
    readonly appliedEvents: EventDto[];
    readonly optimisticEvents: CommandDto[];
    readonly doc: Doc;
}

const cursorId = v4();

const initialEvent = {
    id: "init",
    sequence: -Infinity,
    cursorId,
    command: { type: "TYPE", char: "Hello, World!" } as TypeCommand
};

const initialState: EditorState = {
    cursor: cursorId,
    appliedEvents: [initialEvent],
    optimisticEvents: [],
    doc: new EventStore([initialEvent]).state
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
        default:
            return state;
    }
}
