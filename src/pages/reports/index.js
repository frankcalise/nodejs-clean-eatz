import React from "react";
import { Link } from "react-router-dom";
import NonOrderingCustomers from "./NonOrderingCustomers";
import OrdersGroupedBySatellite from "./OrdersGroupedBySatellite";

const reportComponents = {
  1: NonOrderingCustomers,
  2: OrdersGroupedBySatellite
};

export default class Reports extends React.Component {
  render() {
    const id = this.props.match.params.id;
    const ReportComponent = id ? reportComponents[id] : null;

    let body = null;
    if (ReportComponent) {
      body = <ReportComponent />;
    } else {
      body = (
        <div className="reports">
          <h1>Reports</h1>
          <ul>
            <li>
              <Link to="/reports/1">Non-ordering Customers</Link>
            </li>
            <li>
              <Link to="/reports/2">Orders Grouped by Satellite Location</Link>
            </li>
          </ul>
        </div>
      );
    }

    return body;
  }
}
