import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import OrderCountSummaryChart from "./OrderCountSummaryChart";
import CurrentMealPlanTable from "./CurrentMealPlanTable";

const styles = theme => ({
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  }
});

class Dashboard extends React.Component {
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
        <div className={classes.tableContainer}>
          <CurrentMealPlanTable />
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
