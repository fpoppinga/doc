import { Doc } from "../../lib/doc";
import {
    Command,
    DeleteCommand,
    MoveCommand,
    TypeCommand
} from "../../lib/command";
import v4 = require("uuid/v4");

export interface EditorState {
    readonly cursor: string;
    readonly doc: Doc;
}

const initialState: EditorState = {
    cursor: v4(),
    doc: new Doc("Hello, world!", new Map())
};

export function editorReducer(
    state: EditorState = initialState,
    action: Command
): EditorState {
    switch (action.type) {
        case "TYPE":
            return {
                ...state,
                doc: state.doc.insertAt(
                    state.cursor,
                    (action as TypeCommand).char
                )
            };
        case "MOVE":
            return {
                ...state,
                doc: state.doc.moveCursor(
                    state.cursor,
                    (action as MoveCommand).distance
                )
            };
        case "DELETE":
            return {
                ...state,
                doc: state.doc.deleteAt(
                    state.cursor,
                    (action as DeleteCommand).length
                )
            };
        default:
            return state;
    }
}
