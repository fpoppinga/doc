import { Action, Dispatch, Middleware, MiddlewareAPI } from "redux";

export type AsyncActionState = "OPTIMISTIC" | "RESOLVED" | "REJECTED";
const ASYNC_ACTION_STATES: Set<AsyncActionState> = new Set([
    "OPTIMISTIC",
    "RESOLVED",
    "REJECTED"
] as AsyncActionState[]);

export interface OptimisticAction<T> extends Action {
    type: string;
    state: AsyncActionState;
    payload: T;
    committedPromise: Promise<void>;
}

function isOptimistic<T>(action: any): OptimisticAction<T> | null {
    if (
        action &&
        ASYNC_ACTION_STATES.has(action.state) &&
        action.committedPromise instanceof Promise
    ) {
        return action;
    }

    return null;
}

const optimisticMiddleware: Middleware = (api: MiddlewareAPI<void>) => (
    next: Dispatch<void>
) => <A extends Action>(action: A) => {
    const optimisticAction = isOptimistic(action);
    if (!optimisticAction) {
        return next(action);
    }

    next({ ...optimisticAction, state: "OPTIMISTIC" });
    optimisticAction.committedPromise
        .then(() => next({ ...optimisticAction, state: "RESOLVED" }))
        .catch(error =>
            next({ ...optimisticAction, state: "REJECTED", error })
        );

    return action;
};

export default optimisticMiddleware;
