import { Action, Dispatch } from "redux";
import { EventDto } from "../../lib/event";

export interface EventAction extends Action {
    type: "EVENT";
    payload: EventDto;
}

export function eventAction(payload: EventDto): EventAction {
    return {
        type: "EVENT",
        payload
    };
}
