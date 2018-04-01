import {
    Command,
    DeleteCommand,
    MoveCommand,
    TypeCommand
} from "../../lib/command";
import { Action } from "redux";

export interface CommandAction extends Action {
    type: "COMMAND";
    command: Command;
}

function commandAction(command: Command): CommandAction {
    return {
        type: "COMMAND",
        command
    };
}

export function moveCaret(distance: number): CommandAction {
    return commandAction({
        type: "MOVE",
        distance
    } as MoveCommand);
}

export function typeText(char: string): CommandAction {
    return commandAction({
        type: "TYPE",
        char
    } as TypeCommand);
}

export function deleteText(length: number): CommandAction {
    return commandAction({
        type: "DELETE",
        length
    } as DeleteCommand);
}
