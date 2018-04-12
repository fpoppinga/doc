import { h, render } from "preact";
import App from "./components/app";
import rootReducer from "./reducers/index";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "preact-redux";
import optimisticMiddleware from "./middleware/asyncAction";
import thunk from "redux-thunk";

const store = createStore(
    rootReducer,
    applyMiddleware(thunk, optimisticMiddleware)
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.body
);

require("./style/style.scss");
