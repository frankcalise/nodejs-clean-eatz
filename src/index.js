import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./index.css";
import DefaultLayout from "./components/DefaultLayout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router>
    <Switch>
      <DefaultLayout exact path="/" component={Dashboard} />
      <DefaultLayout path="/customers/:id?" component={Customers} />
      <DefaultLayout path="/reports/:id?" component={Reports} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
