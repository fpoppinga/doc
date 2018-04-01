import {
    Command,
    CommandDto,
    DeleteCommand,
    MoveCommand,
    TypeCommand
} from "../command";
import { Doc } from "../doc";
import { aggregate } from "../aggregator";
import { createEvent } from "../event";

describe("EventIntegration", () => {
    test("Adding some text", () => {
        const commands: CommandDto[] = [
            {
                id: "1",
                cursorId: "Alice",
                command: {
                    type: "TYPE",
                    char: "Aha!"
                } as TypeCommand
            },
            {
                id: "2",
                cursorId: "Bob",
                command: {
                    type: "TYPE",
                    char: "Yes, "
                } as TypeCommand
            }
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
        const commands: CommandDto[] = [
            {
                id: "1",
                cursorId: "Alice",
                command: {
                    type: "TYPE",
                    char: "Aha!"
                } as TypeCommand
            },
            {
                id: "2",
                cursorId: "Bob",
                command: {
                    type: "MOVE",
                    distance: 3
                } as MoveCommand
            },
            {
                id: "3",
                cursorId: "Bob",
                command: {
                    type: "DELETE",
                    length: 3
                } as DeleteCommand
            }
        ];

        const initialState = new Doc("", new Map());
        const finalState = aggregate(initialState, commands.map(createEvent));

        expect(finalState.text).toBe("!");
        expect([...finalState.cursors.entries()]).toEqual([
            ["Alice", { position: 1 }],
            ["Bob", { position: 0 }]
        ]);
    });

    test("empty event list", () => {
        const initialState = new Doc("", new Map());
        const finalState = aggregate(initialState, []);

        expect(finalState).toEqual(initialState);
    });
});
