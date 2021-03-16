import React from "react";
import { render } from "react-dom";

import { Provider } from "react-redux";
import "./i18n";
import store from "./store/store";
import App from "./App";

import * as serviceWorker from "./serviceWorker";

const rootElement = document.getElementById("root");
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

// ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
