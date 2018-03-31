export type CommandType = "TYPE" | "DELETE" | "MOVE";

export interface Command {
    readonly type: CommandType;
}

export interface TypeCommand extends Command {
    readonly type: "TYPE";
    readonly char: string;
}

export interface DeleteCommand extends Command {
    readonly type: "DELETE";
    readonly length: number;
}

export interface MoveCommand extends Command {
    readonly type: "MOVE";
    readonly distance: number;
}

export interface CommandDto {
    readonly id: string;
    readonly cursorId: string;
    readonly command: Command;
}
