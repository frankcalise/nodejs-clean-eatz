import React from "react";
import { Link } from "react-router-dom";
import NonOrderingCustomers from "./reports/NonOrderingCustomers";

const REPORTS = {
  1: NonOrderingCustomers
};

export default class Reports extends React.Component {
  render() {
    const id = this.props.match.params.id;
    const ReportComponent = id ? REPORTS[id] : null;
    return (
      <div className="reports">
        <h1>Reports</h1>
        <ul>
          <li>
            <Link to="/reports/1">Non-ordering Customers</Link>
          </li>
        </ul>
        <ReportComponent />
      </div>
    );
  }
}
