import { EditorService, InvalidCommandError } from "../editorService";
import { InMemoryEventStore } from "../eventStore";
import { CommandDto } from "../../../lib/command";
import { v4 } from "uuid";
import {WsMessagingService} from '../messagingService';

jest.mock("../eventStore");
jest.mock("../validator");
jest.mock("../messagingService");
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
        const service = new EditorService(new InMemoryEventStore(), new WsMessagingService(4242));
        validator.isValid.mockReturnValue(true);

        await service.consume(testCommand());
        expect(validator.isValid).toHaveBeenCalled();
    });

    it("throws, when the command is not valid", async () => {
        const store = new InMemoryEventStore();
        const service = new EditorService(store, new WsMessagingService(4242));
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
        const service = new EditorService(store, new WsMessagingService(4242));

        validator.isValid.mockReturnValue(true);
        await service.consume(testCommand());
        expect(store.push).toHaveBeenCalled();
    });

    it("publishes valid commands as events", async () => {
        const messaging = new WsMessagingService(4242);
        const store = new InMemoryEventStore();
        const service = new EditorService(store, messaging);

        validator.isValid.mockReturnValue(true);
        const command = testCommand();

        const event = {...command, sequence: 42};
        jest.spyOn(store, "push").mockReturnValue(event);

        await service.consume(command);
        expect(messaging.publish).toHaveBeenCalledWith(event);
    });
});
