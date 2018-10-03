import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getLatestOrderSummary } from "../../state/orderSummaries/selectors";

const propTypes = {
  classes: PropTypes.object.isRequired
};

const getState = state => {
  return {
    data: getLatestOrderSummary(state)
  };
};

const styles = {
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
};

class CurrentMealPlanTable extends React.Component {
  render() {
    const { classes, data } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Meal</TableCell>
              <TableCell numeric>Total</TableCell>
              <TableCell numeric>Standard</TableCell>
              <TableCell numeric>Extra Protein</TableCell>
              <TableCell numeric>Gluten Free</TableCell>
              <TableCell numeric>Half Carb</TableCell>
              <TableCell numeric>No Carb</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.meals.map(n => {
              return (
                <TableRow key={n.name}>
                  <TableCell component="th" scope="row">
                    {n.name}
                  </TableCell>
                  <TableCell numeric>{n.total}</TableCell>
                  <TableCell numeric>{n.standard}</TableCell>
                  <TableCell numeric>{n.extraProtein}</TableCell>
                  <TableCell numeric>{n.glutenFree}</TableCell>
                  <TableCell numeric>{n.halfCarb}</TableCell>
                  <TableCell numeric>{n.noCarb}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

CurrentMealPlanTable.propTypes = propTypes;

export default connect(getState)(withStyles(styles)(CurrentMealPlanTable));
