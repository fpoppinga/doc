import { Cursor, Doc } from "../doc";

describe("Doc", () => {
    it("contains text", () => {
        const doc = new Doc("Text", new Map());
        expect(doc.text).toBe("Text");
    });

    it("has cursors", () => {
        const doc = new Doc("", new Map([["1", { position: 1 }]]));
        expect(doc.cursors.get("1")).toEqual({ position: 1 });
    });

    describe("navigation", () => {
        it("can move the cursor", () => {
            const doc = new Doc("...", new Map([["cursor", { position: 1 }]]));

            const movements = [
                { distance: 0, expected: 1 },
                { distance: 52, expected: 3 },
                { distance: -1, expected: 0 },
                { distance: -100, expected: 0 }
            ];

            for (const { distance, expected } of movements) {
                expect(
                    doc.moveCursor("cursor", distance).cursors.get("cursor")
                ).toEqual({ position: expected });
            }
        });
    });

    describe("editing", () => {
        it("can immutably insert text at a cursor", () => {
            const doc = new Doc(
                "This is test.",
                new Map([["testCursor", { position: 7 }]])
            );

            const nextDoc = doc.insertAt("testCursor", " a");
            expect(nextDoc.text).toBe("This is a test.");
        });

        it("inserts text at the start, if the cursor dos not exist", () => {
            const doc = new Doc("a test.", new Map());

            const nextDoc = doc.insertAt("i_do_not_exist", "This is really ");
            expect(nextDoc.text).toBe("This is really a test.");
        });

        it("moves the cursors behind the inserted text.", () => {
            const cursors = new Map<string, Cursor>([
                ["before", { position: 0 }],
                ["after", { position: 1 }]
            ]);

            const doc = new Doc("|", cursors);
            const nextDoc = doc.insertAt("before", "_");

            const before = nextDoc.cursors.get("before");
            const after = nextDoc.cursors.get("after");

            if (!before || !after) {
                expect(before).toBeDefined();
                expect(after).toBeDefined();
                return;
            }

            expect(before.position).toBe(1);
            expect(after.position).toBe(2);
        });

        it("can delete text", () => {
            const doc = new Doc(
                "This usually is a test.",
                new Map([["cursor", { position: 12 }]])
            );

            const nextDoc = doc.deleteAt("cursor", 8);
            expect(nextDoc.text).toBe("This is a test.");
        });

        it("moves the cursors correctly, when deleting text.", () => {
            const cursors = new Map<string, Cursor>([
                ["before", { position: 0 }],
                ["cursor", { position: 12 }],
                ["inside", { position: 8 }],
                ["after", { position: 20 }]
            ]);

            const doc = new Doc("This usually is a test.", cursors);
            const nextDoc = doc.deleteAt("cursor", 8);

            expect([...nextDoc.cursors.entries()]).toEqual([
                ["before", { position: 0 }],
                ["cursor", { position: 4 }],
                ["inside", { position: 4 }],
                ["after", { position: 12 }]
            ]);
        });

        it("can delete more text than there actually is.", () => {
            const doc = new Doc(
                "This is.",
                new Map([["cursor", { position: 4 }]])
            );

            const nextDoc = doc.deleteAt("cursor", 42);
            expect(nextDoc.text).toBe(" is.");
            expect([...nextDoc.cursors.entries()]).toEqual([
                ["cursor", { position: 0 }]
            ]);
        });
    });
});
