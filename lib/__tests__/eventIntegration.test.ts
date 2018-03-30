import { Command, DeleteCommand, MoveCommand, TypeCommand } from "../command";
import { Doc } from "../doc";
import { aggregate } from "../aggregator";
import { createEvent } from "../event";

describe("EventIntegration", () => {
    test("Adding some text", () => {
        const commands: Command[] = [
            {
                id: "1",
                cursorId: "Alice",
                type: "TYPE",
                char: "Aha!"
            } as TypeCommand,
            {
                id: "2",
                cursorId: "Bob",
                type: "TYPE",
                char: "Yes, "
            } as TypeCommand
        ];

        const initialState = new Doc("", new Map());

        const finalState = aggregate(initialState, commands.map(createEvent));
        expect(finalState.text).toBe("Yes, Aha!");
        expect([...finalState.cursors.entries()]).toEqual([
            ["Alice", { position: 9 }],
            ["Bob", { position: 5 }]
        ]);
    });

    test("Deleting some text", () => {
        const commands: Command[] = [
            {
                id: "1",
                cursorId: "Alice",
                type: "TYPE",
                char: "Aha!"
            } as TypeCommand,
            {
                id: "2",
                cursorId: "Bob",
                type: "MOVE",
                distance: 3
            } as MoveCommand,
            {
                id: "3",
                cursorId: "Bob",
                type: "DELETE",
                length: 3
            } as DeleteCommand
        ];

        const initialState = new Doc("", new Map());
        const finalState = aggregate(initialState, commands.map(createEvent));

        expect(finalState.text).toBe("!");
        expect([...finalState.cursors.entries()]).toEqual([
            ["Alice", { position: 1 }],
            ["Bob", { position: 0 }]
        ]);
    });
});
