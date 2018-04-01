import { Doc } from "../doc";
import { DeleteCommand, MoveCommand, TypeCommand } from "../command";
import { DeleteEvent, MoveEvent, TypeEvent } from "../event";

jest.mock("../doc");

describe("TypeEvent", () => {
    it("inserts text", () => {
        const doc = new Doc("", new Map());

        const command: TypeCommand = {
            type: "TYPE",
            char: "bananas!"
        };

        const event = new TypeEvent("myCursor", command);
        event.apply(doc);

        expect(doc.insertAt).toHaveBeenCalledWith("myCursor", "bananas!");
    });
});

describe("DeleteEvent", () => {
    it("deletes text", () => {
        const doc = new Doc("", new Map());

        const command: DeleteCommand = {
            type: "DELETE",
            length: 42
        };

        const event = new DeleteEvent("myCursor", command);
        event.apply(doc);

        expect(doc.deleteAt).toHaveBeenCalledWith("myCursor", 42);
    });
});

describe("MoveEvent", () => {
    it("moves the cursor", () => {
        const doc = new Doc("", new Map());

        const command: MoveCommand = {
            type: "MOVE",
            distance: 42
        };

        const event = new MoveEvent("myCursor", command);
        event.apply(doc);

        expect(doc.moveCursor).toHaveBeenCalledWith("myCursor", 42);
    });
});
