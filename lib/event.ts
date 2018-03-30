import { Doc } from "./doc";
import { Command, DeleteCommand, MoveCommand, TypeCommand } from "./command";

export interface Event<T extends Command> {
    readonly command: T;

    apply(doc: Doc): Doc;
}

export class TypeEvent implements Event<TypeCommand> {
    constructor(readonly command: TypeCommand) {}

    apply(doc: Doc): Doc {
        return doc.insertAt(this.command.cursorId, this.command.char);
    }
}

export class DeleteEvent implements Event<DeleteCommand> {
    constructor(readonly command: DeleteCommand) {}

    apply(doc: Doc): Doc {
        return doc.deleteAt(this.command.cursorId, this.command.length);
    }
}

export class MoveEvent implements Event<MoveCommand> {
    constructor(readonly command: MoveCommand) {}

    apply(doc: Doc): Doc {
        return doc.moveCursor(this.command.cursorId, this.command.distance);
    }
}

export function createEvent(command: Command): Event<Command> {
    switch (command.type) {
        case "DELETE":
            return new DeleteEvent(command as DeleteCommand);
        case "TYPE":
            return new TypeEvent(command as TypeCommand);
        case "MOVE":
            return new MoveEvent(command as MoveCommand);
    }
}
