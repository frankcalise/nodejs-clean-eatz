import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./index.css";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router>
    <div>
      <Route exact path="/" component={Customers} />
      <Route path="/reports/:id?" component={Reports} />
    </div>
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
