import { EditorService, InvalidCommandError } from "../editorService";
import { InMemoryEventStore } from "../eventStore";
import { CommandDto } from "../../../lib/command";
import { v4 } from "uuid";

jest.mock("../eventStore");
jest.mock("../validator");
const validator = require("../validator");

function testCommand(): CommandDto {
    return {
        id: v4(),
        cursorId: v4(),
        command: {
            type: "TYPE"
        }
    };
}

describe("EditorService", () => {
    it("validates incoming commands", async () => {
        const service = new EditorService(new InMemoryEventStore());
        validator.isValid.mockReturnValue(true);

        await service.consume(testCommand());
        expect(validator.isValid).toHaveBeenCalled();
    });

    it("throws, when the command is not valid", async () => {
        const store = new InMemoryEventStore();
        const service = new EditorService(store);
        validator.isValid.mockReturnValue(false);

        try {
            await service.consume(testCommand());
            fail("Expected exception to be thrown.");
        } catch (e) {
            expect(e).toBeInstanceOf(InvalidCommandError);
        }

        expect(validator.isValid).toHaveBeenCalled();
        expect(store.push).not.toHaveBeenCalled();
    });

    it("stores valid commands", async () => {
        const store = new InMemoryEventStore();
        const service = new EditorService(store);

        validator.isValid.mockReturnValue(true);
        await service.consume(testCommand());
        expect(store.push).toHaveBeenCalled();
    });
});
