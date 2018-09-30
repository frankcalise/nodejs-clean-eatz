import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import firebase from "../../config/firebase";

const propTypes = {
  classes: PropTypes.object.isRequired
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
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    firebase
      .database()
      .ref("orderSummaries")
      .orderByKey()
      .limitToLast(1)
      .once("value")
      .then(snapshot => {
        const data = [];

        snapshot.forEach(childSnapshot => {
          const summary = childSnapshot.val();
          const { meals } = summary;

          Object.keys(meals).forEach(mealKey => {
            const {
              total,
              standard,
              extraProtein,
              glutenFree,
              halfCarb,
              noCarb
              // epGf,
              // epHc,
              // epNc,
              // gfHc,
              // gfNc,
              // epGfNc,
              // epGfHc
            } = meals[mealKey];

            data.push({
              name: mealKey,
              total,
              standard,
              extraProtein,
              glutenFree,
              halfCarb,
              noCarb
            });
          });
        });

        this.setState({ data });
      });
  };

  render() {
    const { classes } = this.props;

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
            {this.state.data.map(n => {
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

export default withStyles(styles)(CurrentMealPlanTable);
