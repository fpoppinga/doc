export type CommandType = "TYPE" | "DELETE" | "MOVE";

export interface Command {
    readonly id: string;
    readonly cursorId: string;
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
