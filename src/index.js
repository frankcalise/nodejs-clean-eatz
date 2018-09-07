import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import DefaultLayout from "./components/DefaultLayout";
import NavBar from "./components/NavBar";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Router>
    <div>
      <NavBar />
      <DefaultLayout exact path="/" component={Customers} />
      <DefaultLayout path="/reports/:id?" component={Reports} />
    </div>
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
