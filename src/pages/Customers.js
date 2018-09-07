import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import fire from "../fire";
import { snapshotToArray } from "../utils/firebaseUtils";
import CustomerDetail from "./customers/CustomerDetail";

const propTypes = { classes: PropTypes.object.isRequired };

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
  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
  }

  componentDidMount() {
    const customersRef = fire
      .database()
      .ref("customers")
      .orderByKey();
    customersRef.once("value").then(snapshot => {
      const customers = snapshotToArray(snapshot);
      this.setState({ customers });
    });
  }

  render() {
    const { classes } = this.props;
    const customerKey = this.props.match.params.id;

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <Paper className={classes.paper}>
              <div className="customers-list">
                <h1>
                  Meal Plan Customers{" "}
                  <small>{this.state.customers.length}</small>
                </h1>
                <ul>
                  {this.state.customers.map(x => (
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
              {customerKey && <CustomerDetail customerKey={customerKey} />}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Customers.propTypes = propTypes;

export default withStyles(styles)(Customers);
