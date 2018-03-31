import { Doc } from "../doc";
import { DeleteCommand, TypeCommand } from "../command";
import { DeleteEvent, TypeEvent } from "../event";

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
