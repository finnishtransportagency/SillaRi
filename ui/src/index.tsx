import { defineCustomElements } from "@ionic/pwa-elements/loader";

import React from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import "./i18n";
import store from "./store/store";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement as Element);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Call the element loader after the app has been rendered the first time
defineCustomElements(window);
