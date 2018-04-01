import { Doc } from "./doc";
import {
    Command,
    CommandDto,
    DeleteCommand,
    MoveCommand,
    TypeCommand
} from "./command";

export interface Event<T extends Command> {
    readonly command: T;

    apply(doc: Doc): Doc;
}

export class TypeEvent implements Event<TypeCommand> {
    constructor(readonly cursorId: string, readonly command: TypeCommand) {}

    apply(doc: Doc): Doc {
        return doc.insertAt(this.cursorId, this.command.char);
    }
}

export class DeleteEvent implements Event<DeleteCommand> {
    constructor(readonly cursorId: string, readonly command: DeleteCommand) {}

    apply(doc: Doc): Doc {
        return doc.deleteAt(this.cursorId, this.command.length);
    }
}

export class MoveEvent implements Event<MoveCommand> {
    constructor(readonly cursorId: string, readonly command: MoveCommand) {}

    apply(doc: Doc): Doc {
        return doc.moveCursor(this.cursorId, this.command.distance);
    }
}

export interface EventDto extends CommandDto {
    readonly sequence: number;
}

export function createEvent(commandDto: CommandDto): Event<Command> {
    const { command, cursorId } = commandDto;

    switch (command.type) {
        case "DELETE":
            return new DeleteEvent(cursorId, command as DeleteCommand);
        case "TYPE":
            return new TypeEvent(cursorId, command as TypeCommand);
        case "MOVE":
            return new MoveEvent(cursorId, command as MoveCommand);
    }
}
