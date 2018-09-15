import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./index.css";
import DefaultLayout from "./components/DefaultLayout";
import Dashboard from "./pages/dashboard";
import Customers from "./pages/customers";
import Reports from "./pages/reports";
import registerServiceWorker from "./registerServiceWorker";
import SuperCustom from "./pages/super_custom";

ReactDOM.render(
  <Router>
    <Switch>
      <DefaultLayout exact path="/" component={Dashboard} />
      <DefaultLayout path="/customers/:id?" component={Customers} />
      <DefaultLayout path="/reports/:id?" component={Reports} />
      <DefaultLayout path="/super-custom" component={SuperCustom} />
    </Switch>
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
