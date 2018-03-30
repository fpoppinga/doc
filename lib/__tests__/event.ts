import { Doc } from "../doc";
import { DeleteCommand, TypeCommand } from "../command";
import { DeleteEvent, TypeEvent } from "../event";

jest.mock("../doc");

describe("TypeEvent", () => {
    it("inserts text", () => {
        const doc = new Doc("", new Map());

        const command: TypeCommand = {
            type: "TYPE",
            id: "id",
            char: "bananas!",
            cursorId: "myCursor"
        };

        const event = new TypeEvent(command);
        event.apply(doc);

        expect(doc.insertAt).toHaveBeenCalledWith("myCursor", "bananas!");
    });
});

describe("DeleteEvent", () => {
    it("deletes text", () => {
        const doc = new Doc("", new Map());

        const command: DeleteCommand = {
            type: "DELETE",
            id: "id",
            cursorId: "myCursor",
            length: 42
        };

        const event = new DeleteEvent(command);
        event.apply(doc);

        expect(doc.deleteAt).toHaveBeenCalledWith("myCursor", 42);
    });
});
