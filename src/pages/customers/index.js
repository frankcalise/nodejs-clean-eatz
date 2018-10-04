import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CustomerDetail from "./CustomerDetail";
import WithLoader from "../../components/WithLoader";
import { fetchCustomers } from "../../state/customers/actions";
import { encodeAsFirebaseKey } from "../../utils/firebaseUtils";

const propTypes = { classes: PropTypes.object.isRequired };

const getState = state => ({
  customers: state.customers
});

const getActions = {
  fetchCustomers
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class Customers extends React.Component {
  state = {
    loaded: false
  };

  componentDidMount() {
    Promise.all([this.props.fetchCustomers()])
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loaded: true });
      });
  }

  render() {
    const { classes } = this.props;
    const customerKey = encodeAsFirebaseKey(this.props.match.params.id || "");

    return (
      <WithLoader condition={this.state.loaded} message="Loading Customers">
        <div className={classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <div className="customers-list">
                  <h1>
                    Meal Plan Customers{" "}
                    <small>{this.props.customers.length}</small>
                  </h1>
                  <ul>
                    {this.props.customers.map(x => (
                      <li key={x.key}>
                        <Link to={`/customers/${x.key}`}>{x.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={9}>
              <Paper className={classes.paper}>
                {customerKey && (
                  <CustomerDetail
                    data={this.props.customers.find(x => x.key === customerKey)}
                  />
                )}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </WithLoader>
    );
  }
}

Customers.propTypes = propTypes;

export default connect(
  getState,
  getActions
)(withStyles(styles)(Customers));
