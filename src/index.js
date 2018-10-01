import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import App from "./components/App";
import configureStore from "./store";
import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

const reduxStore = configureStore();

ReactDOM.render(
  <ReduxProvider store={reduxStore}>
    <App />
  </ReduxProvider>,
  document.getElementById("root")
);
registerServiceWorker();
