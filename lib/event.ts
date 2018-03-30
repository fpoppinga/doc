import { Doc } from "./doc";
import { Command, TypeCommand } from "./command";

export interface Event<T extends Command> {
    readonly command: T;

    apply(doc: Doc): Doc;
}

export class TypeEvent implements Event<TypeCommand> {
    readonly command: TypeCommand;

    constructor(command: TypeCommand) {
        this.command = command;
    }

    apply(doc: Doc): Doc {
        return doc.insertAt(this.command.cursorId, this.command.char);
    }
}
