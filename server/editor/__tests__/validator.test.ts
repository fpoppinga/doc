import { v4 } from "uuid";
import { isValid } from "../validator";
import { Command, CommandDto, TypeCommand } from "../../../lib/command";

function testCommand(): CommandDto {
    return {
        id: v4(),
        cursorId: v4(),
        command: {
            type: "TYPE",
            char: "a"
        } as TypeCommand
    };
}

describe("Validator", () => {
    it("is valid for a valid command", () => {
        const command: CommandDto = testCommand();

        expect(isValid(command)).toBe(true);
    });

    it("requires the id to be a uuid", () => {
        const command = { ...testCommand(), id: "I_AM_NOT_VALID_AT_ALL" };
        expect(isValid(command)).toBe(false);
    });

    it("requires the cursor to be a uuid", () => {
        const command = { ...testCommand(), cursorId: "I_AM_ALSO_NOT_VALID!" };
        expect(isValid(command)).toBe(false);
    });

    it("requires the type to be correct", () => {
        const command: any = { ...testCommand(), command: { type: "INVALID" } };
        expect(isValid(command)).toBe(false);
    });

    it("does not accept null", () => {
        expect(isValid(null)).toBe(false);
    });
});
