import React from "react";
import { Link } from "react-router-dom";
import NonOrderingCustomers from "./NonOrderingCustomers";
import OrdersGroupedBySatellite from "./OrdersGroupedBySatellite";
import FirstTimeCustomers from "./FirstTimeCustomers";
import MealsByMenuDate from "./MealsByMenuDate";

const reportComponents = {
  1: NonOrderingCustomers,
  2: OrdersGroupedBySatellite,
  3: FirstTimeCustomers,
  4: MealsByMenuDate
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
            <li>
              <Link to="/reports/3">First Time Customers</Link>
            </li>
            <li>
              <Link to="/reports/4">Meals by Menu Date</Link>
            </li>
          </ul>
        </div>
      );
    }

    return body;
  }
}
