import { h, render } from "preact";
import App from "./components/app";
import rootReducer from "./reducers/index";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "preact-redux";
import optimisticMiddleware from "./middleware/asyncAction";
import thunk from "redux-thunk";
import { EditorSocket } from "./api/editorSocket";

const store = createStore(
    rootReducer,
    applyMiddleware(thunk, optimisticMiddleware)
);

const editorSocket = new EditorSocket(
    store,
    `http://${window.location.hostname}:8081`
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.body
);

require("./style/style.scss");

if ("serviceWorker" in navigator) {
    (navigator as any).serviceWorker
        .register("/sw.js")
        .then((reg: ServiceWorkerRegistration) => {
            console.log("Registration succeeded. Scope is " + reg.scope);
        })
        .catch((error: Error) => {
            console.log("Registration failed with " + error);
        });
}
