import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import DefaultLayout from "./DefaultLayout";
import Dashboard from "../pages/dashboard";
import Customers from "../pages/customers";
import Reports from "../pages/reports";
import Orders from "../pages/orders";
import SignIn from "../pages/auth";
import SuperCustom from "../pages/super_custom";
import { authOperations } from "../state/auth";

const getActions = dispatch => {
  return {
    fetchUser: () => dispatch(authOperations.fetchUser())
  };
};

class App extends Component {
  componentWillMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <Router>
        <Switch>
          <DefaultLayout exact path="/" component={RequireAuth(Dashboard)} />
          <DefaultLayout
            path="/customers/:id?"
            component={RequireAuth(Customers)}
          />
          <DefaultLayout
            path="/reports/:id?"
            component={RequireAuth(Reports)}
          />
          <DefaultLayout path="/super-custom" component={SuperCustom} />
          <DefaultLayout path="/orders" component={RequireAuth(Orders)} />
          <Route path="/sign-in" component={SignIn} />
        </Switch>
      </Router>
    );
  }
}

export default connect(
  null,
  getActions
)(App);