import { h, render } from "preact";
import App from "./components/app";
import rootReducer from "./reducers/index";
import { createStore } from "redux";
import { Provider } from "preact-redux";

const store = createStore(rootReducer);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.body
);
