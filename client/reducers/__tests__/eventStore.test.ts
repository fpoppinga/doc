import { EventStore } from "../eventStore";
import { Doc } from "../../../lib/doc";
import { TypeCommand } from "../../../lib/command";

describe("EventStore", () => {
    it("stores events", () => {
        const store = new EventStore([]);

        expect(store.state).toEqual(new Doc("", new Map()));
        expect(store.state).toEqual(store.optimisticState);
    });

    it("considers applied events", () => {
        const store = new EventStore([
            {
                id: "a",
                command: {
                    type: "TYPE",
                    char: "a"
                } as TypeCommand,
                cursorId: "cursorId",
                sequence: 0
            }
        ]);

        expect(store.state).toEqual(
            new Doc("a", new Map([["cursorId", { position: 1 }]]))
        );
        expect(store.state).toEqual(store.optimisticState);
    });

    it("handles optimistic update", () => {
        const store = new EventStore([]);
        store.optimisticUpdate({
            id: "a",
            command: {
                type: "TYPE",
                char: "b"
            } as TypeCommand,
            cursorId: "cursorId"
        });

        expect(store.state).toEqual(new Doc("", new Map()));
        expect(store.optimisticState).toEqual(
            new Doc("b", new Map([["cursorId", { position: 1 }]]))
        );
    });

    it("removes optimistic commands from the storage, when the command gets confirmed", () => {
        const store = new EventStore([]);

        store.optimisticUpdate({
            id: "a",
            command: {
                type: "TYPE",
                char: "c"
            } as TypeCommand,
            cursorId: "cursorId"
        });

        store.update({
            id: "a",
            command: {
                type: "TYPE",
                char: "c"
            } as TypeCommand,
            cursorId: "cursorId",
            sequence: 1
        });

        expect(store.state).toEqual(store.optimisticState);
        expect(store.state).toEqual(
            new Doc("c", new Map([["cursorId", { position: 1 }]]))
        );
    });

    it("orders applied events by sequence number", () => {
        const store = new EventStore([
            {
                id: "a",
                command: {
                    type: "TYPE",
                    char: "b"
                } as TypeCommand,
                cursorId: "cursorId",
                sequence: 4
            },
            {
                id: "b",
                command: {
                    type: "TYPE",
                    char: "a"
                } as TypeCommand,
                cursorId: "cursorId",
                sequence: 1
            }
        ]);

        expect(store.state).toEqual(
            new Doc("ab", new Map([["cursorId", { position: 2 }]]))
        );
    });

    it("ignores updates with existing ids", () => {
        const store = new EventStore([
            {
                id: "a",
                command: {
                    type: "TYPE",
                    char: "b"
                } as TypeCommand,
                cursorId: "cursorId",
                sequence: 4
            }
        ]);

        store.update({
            id: "a",
            command: {
                type: "TYPE",
                char: "b"
            } as TypeCommand,
            cursorId: "cursorId",
            sequence: 4
        });

        expect(store.appliedEvents).toHaveLength(1);
        expect(store.state).toEqual(
            new Doc("b", new Map([["cursorId", { position: 1 }]]))
        );
    });
});
