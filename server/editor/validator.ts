import { CommandDto, CommandType } from "../../lib/command";

export function isUUID(input?: string): boolean {
    return (
        !!input &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
            input
        )
    );
}

function isValidType(type: CommandType) {
    return new Set(["TYPE", "MOVE", "DELETE"]).has(type);
}

export function isValid(event: CommandDto): boolean {
    return (
        !!event &&
        isUUID(event.id) &&
        isUUID(event.cursorId) &&
        isValidType(event.command.type)
    );
}
