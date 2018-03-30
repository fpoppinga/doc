export type CommandType = "TYPE";

export interface Command {
    readonly id: string;
    readonly cursorId: string;
    readonly type: CommandType;
}

export interface TypeCommand extends Command {
    readonly type: "TYPE";
    readonly char: string;
}
