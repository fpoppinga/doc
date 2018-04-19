import * as path from "path";
import express from "express";
import serveStatic from "serve-static";
import { InMemoryEventStore } from "./editor/eventStore";
import { EditorService, InvalidCommandError } from "./editor/editorService";
import { json } from "body-parser";
import { WsMessagingService } from "./editor/messagingService";
import { TypeCommand } from "../lib/command";

const eventStore = new InMemoryEventStore();
const messagingService = new WsMessagingService(
    parseInt(process.env["WEBSOCKET_PORT"] || "8081", 10)
);
const editorService = new EditorService(eventStore, messagingService);

const app = express();
app.use(serveStatic(path.resolve(__dirname, "../../dist")));
app.put("/event", json(), async (req, res) => {
    const command = req.body;
    try {
        await editorService.consume(command);
        return res.status(204).send();
    } catch (e) {
        if (e instanceof InvalidCommandError) {
            return res.status(400).send({ error: e.message });
        }

        return res.status(500).send();
    }
});

app.get("/events/:since", async (req, res) => {
    return res
        .status(200)
        .send(await eventStore.getSince(parseInt(req.params.since, 10)));
});

app.listen(process.env["PORT"] || 8080);
