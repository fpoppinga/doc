import { DeleteCommand, MoveCommand, TypeCommand } from "../../lib/command";

export function moveCaret(distance: number): MoveCommand {
    return {
        type: "MOVE",
        distance
    };
}

export function typeText(char: string): TypeCommand {
    return {
        type: "TYPE",
        char
    };
}

export function deleteText(length: number): DeleteCommand {
    return {
        type: "DELETE",
        length
    };
}
