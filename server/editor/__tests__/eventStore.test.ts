import { EventStore, InMemoryEventStore } from "../eventStore";
import { CommandDto } from "../../../lib/command";

function testCommand(id: string): CommandDto {
    return {
        id,
        command: {
            type: "TYPE"
        },
        cursorId: "cursorId"
    };
}

function testEventStore(name: string, eventStore: EventStore) {
    describe(name, () => {
        beforeEach(async () => {
            await eventStore.clear();
        });

        it("stores events and increases the sequence number", async () => {
            const event = await eventStore.push(testCommand("a"));
            expect(event.sequence).toBe(0);

            const event2 = await eventStore.push(testCommand("b"));
            expect(event2.sequence).toBe(1);
        });

        it("returns the events in order", async () => {
            await eventStore.push(testCommand("a"));
            await eventStore.push(testCommand("b"));

            const events = await eventStore.getAll();
            expect(events.map(e => e.id)).toEqual(["a", "b"]);
        });

        it("returns events after a certain event", async () => {
            await eventStore.push(testCommand("a"));
            await eventStore.push(testCommand("b"));
            await eventStore.push(testCommand("c"));

            const latestEvents = await eventStore.getSince("a");
            expect(latestEvents.map(e => e.id)).toEqual(["b", "c"]);

            const noEvents = await eventStore.getSince("Banana");
            expect(noEvents.length).toBe(0);

            const tooLateEvents = await eventStore.getSince("c");
            expect(tooLateEvents.length).toBe(0);
        });
    });
}

testEventStore("InMemoryEventStore", new InMemoryEventStore());
