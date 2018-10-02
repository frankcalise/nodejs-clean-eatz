import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const SIGN_IN_ROUTE = "/sign-in";

export default function(ComposedComponent) {
  class Authentication extends React.Component {
    static contextTypes = {
      router: PropTypes.object
    };

    componentWillMount() {
      console.log("require auth componentWillMount", this.props);
      if (this.props.authenticated === null) {
        this.context.router.history.push(SIGN_IN_ROUTE);
      }
    }

    componentWillUpdate(nextProps) {
      console.log("require auth componentWillMount", nextProps);
      if (!nextProps.authenticated) {
        this.context.router.history.push(SIGN_IN_ROUTE);
      }
    }

    render() {
      if (this.props.authenticated) {
        return <ComposedComponent {...this.props} />;
      }

      return null;
    }
  }

  const getState = state => {
    return { authenticated: state.auth.user };
  };

  return connect(getState)(Authentication);
}
