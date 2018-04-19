import { EventDto } from "../../lib/event";
import io, { Server, Socket } from "socket.io";
import { v4 } from "uuid";

export interface MessagingService {
    publish(event: EventDto): Promise<void>;
}

export class WsMessagingService implements MessagingService {
    private wss: Server;
    private sockets: Map<string, Socket> = new Map();

    constructor(port: number) {
        this.wss = io();

        this.wss.on("connect", (client: Socket) => {
            const id = v4();
            this.sockets.set(id, client);

            client.on("close", () => {
                this.sockets.delete(id);
            });
        });

        this.wss.listen(port);
    }

    async publish(event: EventDto): Promise<void> {
        [...this.sockets.values()].forEach(ws =>
            ws.emit("event", JSON.stringify(event))
        );
    }
}
