import {
    Command,
    CommandDto,
    DeleteCommand,
    MoveCommand,
    TypeCommand
} from "../../lib/command";
import { OptimisticAction } from "../middleware/asyncAction";
import { EditorClient } from "../api/editorClient";
import { RootState } from "../reducers";
import { Action, Dispatch } from "redux";
import { v4 } from "uuid";
import { ThunkAction } from "redux-thunk";
import { EventDto } from "../../lib/event";

export interface CommandAction extends OptimisticAction<CommandDto> {
    type: "COMMAND";
}

const editorClient = new EditorClient(
    `http://${window.location.hostname}:8080`
);

function commandAction(
    command: Command
): ThunkAction<CommandAction, RootState, void> {
    return (dispatch: Dispatch<RootState>, getState: () => RootState) => {
        const cursorId = getState().editor.cursor;
        const dto: CommandDto = {
            id: v4(),
            cursorId,
            command
        };

        return <CommandAction>dispatch({
            type: "COMMAND",
            payload: dto,
            state: "OPTIMISTIC",
            committedPromise: editorClient.putCommand(dto)
        });
    };
}

export function moveCaret(distance: number) {
    return commandAction({
        type: "MOVE",
        distance
    } as MoveCommand);
}

export function typeText(char: string) {
    return commandAction({
        type: "TYPE",
        char
    } as TypeCommand);
}

export function deleteText(length: number) {
    return commandAction({
        type: "DELETE",
        length
    } as DeleteCommand);
}

export interface FetchEventsAction extends Action {
    type: "FETCH_EVENTS";
    payload: {
        events: EventDto[];
    };
}

export function fetchEventsAction(
    since: number
): ThunkAction<void, RootState, void> {
    return (dispatch: Dispatch<RootState>) => {
        editorClient.getEventsSince(since).then(events =>
            dispatch<FetchEventsAction>({
                type: "FETCH_EVENTS",
                payload: {
                    events
                }
            })
        );
    };
}
