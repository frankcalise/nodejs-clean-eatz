import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import WithLoader from "../../components/WithLoader";
import { getSatelliteOrders } from "../../state/orders/selectors";
import { fetchOrders } from "../../state/orders/actions";
import {
  getLatestOrderSummary,
  getMealNamesFromSummary
} from "../../state/orderSummaries/selectors";

const propTypes = {
  classes: PropTypes.object.isRequired
};

const getState = state => {
  return {
    orders: state.orders,
    satelliteOrders: getSatelliteOrders(state.orders),
    mealNames: getMealNamesFromSummary(
      getLatestOrderSummary(state.orderSummaries)
    )
  };
};

const getActions = {
  fetchOrders
};

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
});

class OrdersGroupedBySatellite extends React.Component {
  state = {
    loaded: false
  };

  componentDidMount() {
    if (this.props.orders.length === 0) {
      Promise.all([this.props.fetchOrders()])
        .then(() => {
          this.setState({ loaded: true });
        })
        .catch(err => {
          console.error(err);
          this.setState({ loaded: true });
        });
    } else {
      this.setState({ loaded: true });
    }
  }

  renderTable = key => {
    const { classes, mealNames } = this.props;
    const rows = this.props.satelliteOrders.filter(
      x => x.satellitePickUp === key
    );

    return (
      <div key={key}>
        <Typography variant="subheading">{key}</Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {mealNames.map(x => {
                  return (
                    <TableCell key={x} numeric>
                      {x}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => {
                const meal0 = row.meals.find(x => x.name === mealNames[0]);
                const meal1 = row.meals.find(x => x.name === mealNames[1]);
                const meal2 = row.meals.find(x => x.name === mealNames[2]);
                const meal3 = row.meals.find(x => x.name === mealNames[3]);
                const meal4 = row.meals.find(x => x.name === mealNames[4]);
                const meal5 = row.meals.find(x => x.name === mealNames[5]);

                return (
                  <TableRow key={row.customerKey}>
                    <TableCell component="th" scope="row">
                      {row.customer.name}
                    </TableCell>
                    <TableCell numeric>{meal0 ? meal0.qty : "0"}</TableCell>
                    <TableCell numeric>{meal1 ? meal1.qty : "0"}</TableCell>
                    <TableCell numeric>{meal2 ? meal2.qty : "0"}</TableCell>
                    <TableCell numeric>{meal3 ? meal3.qty : "0"}</TableCell>
                    <TableCell numeric>{meal4 ? meal4.qty : "0"}</TableCell>
                    <TableCell numeric>{meal5 ? meal5.qty : "0"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  };

  render() {
    // get unique satellite location array
    const groups = this.props.satelliteOrders
      .map(x => x.satellitePickUp)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    if (groups === 0) {
      return (
        <React.Fragment>
          <Typography variant="display1">
            Orders Grouped by Satellite Location
          </Typography>
          <Typography variant="subheading" gutterBottom>
            No satellite orders were placed this week
          </Typography>
        </React.Fragment>
      );
    }

    return (
      <WithLoader
        condition={this.state.loaded}
        message="Grouping Orders By Satellite Location"
      >
        <Typography variant="display1">
          Orders Grouped by Satellite Location
        </Typography>
        {groups.map(group => {
          return this.renderTable(group);
        })}
      </WithLoader>
    );
  }
}

OrdersGroupedBySatellite.propTypes = propTypes;

export default connect(
  getState,
  getActions
)(withStyles(styles)(OrdersGroupedBySatellite));
