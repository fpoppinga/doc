import { CommandDto } from "../../lib/command";
import {EventDto} from '../../lib/event';

export class EditorClient {
    constructor(private baseUrl: string = "http://localhost:8080") {}

    async putCommand(command: CommandDto) {
        try {
            const res = await fetch(this.baseUrl + "/event", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(command)
            });

            if (!res.ok) {
                return Promise.reject(await res.json());
            }

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getEventsSince(since: number): Promise<EventDto[]> {
        try {
            const res = await fetch(this.baseUrl + "/events/" + since.toString());

            if (!res.ok) {
                return Promise.reject(await res.json());
            }

            return Promise.resolve(await res.json());
        } catch (e) {
            return Promise.reject(e);
        }
    }
}
