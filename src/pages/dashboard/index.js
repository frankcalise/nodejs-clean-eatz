import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import WithLoader from "../../components/WithLoader";
import OrderCountSummaryChart from "./OrderCountSummaryChart";
import CurrentMealPlanTable from "./CurrentMealPlanTable";
import MealPlanStackedBarChart from "./MealPlanStackedBarChart";
import { orderSummaryOperations } from "../../state/orderSummaries";

const getActions = dispatch => {
  return {
    fetchOrderSummaries: () =>
      dispatch(orderSummaryOperations.fetchOrderSummaries())
  };
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  }
});

class Dashboard extends React.Component {
  state = {
    loaded: false
  };

  componentDidMount() {
    Promise.all([this.props.fetchOrderSummaries()])
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

    return (
      <WithLoader condition={this.state.loaded} message="Loading Dashboard...">
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
        <Grid container spacing={8}>
          <Grid item xs={12} sm={6}>
            <div className={classes.tableContainer}>
              <CurrentMealPlanTable />
            </div>
          </Grid>
          <Grid item xs={8} sm={2}>
            <div className={classes.tableContainer}>
              <MealPlanStackedBarChart />
            </div>
          </Grid>
        </Grid>
      </WithLoader>
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
