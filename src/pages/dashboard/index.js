import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import OrderCountSummaryChart from "./OrderCountSummaryChart";
import CurrentMealPlanTable from "./CurrentMealPlanTable";
import MealPlanRadarChart from "./MealPlanRadarChart";
import { orderSummaryOperations } from "../../state/orderSummaries";

const getActions = dispatch => {
  return {
    fetchOrderSummaries: () =>
      dispatch(orderSummaryOperations.fetchOrderSummaries())
  };
};

const styles = theme => ({
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  }
});

class Dashboard extends React.Component {
  state = {
    loading: true
  };

  componentDidMount() {
    Promise.all([this.props.fetchOrderSummaries()])
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <Typography variant="display1" gutterBottom>
          Orders at a Glance
        </Typography>
        <Typography component="div" className={classes.chartContainer}>
          <OrderCountSummaryChart />
        </Typography>
        <Typography variant="display1" gutterBottom>
          Current Meal Plan
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={16} sm={8}>
            <div className={classes.tableContainer}>
              <CurrentMealPlanTable />
            </div>
          </Grid>
          <Grid item xs={8} sm={4}>
            <div className={classes.tableContainer}>
              <MealPlanRadarChart />
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  null,
  getActions
)(withStyles(styles)(Dashboard));
