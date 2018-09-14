import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import fire from "../../utils/fire";

const propTypes = {
  classes: PropTypes.object.isRequired
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

const meals = [
  "Arnold in a Bowl",
  "Chicken Fajita",
  "Ham & Cheese Omelette",
  "Keto Chicken",
  "Mashed Potato Bowl",
  "Meatlovers Pizza Pasta"
];

class OrdersGroupedBySatellite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rows: []
    };
  }

  componentDidMount() {
    this.runReport();
  }

  runReport = async () => {
    const orderKey = "70537";
    let satelliteGroups = {};

    const arr = [];
    let satelliteOrders = await fire
      .database()
      .ref(`orders/${orderKey}`)
      .orderByChild("satellite")
      .equalTo(true)
      .once("value")
      .then(async snapshot => {
        snapshot.forEach(childSnapshot => {
          const item = childSnapshot.val();
          item.key = childSnapshot.key;

          arr.push(item);
        });

        return arr;
        // const order = snapshot.val();
        // order.key = snapshot.key;

        // // const name = await getName(order.customerKey);
        // // console.log(name);

        // return order;
      });

    arr.forEach(x => {
      const order = x;

      const { satellitePickUp, customerKey } = order;

      const meal0 = order.meals.find(x => x.name === meals[0]);
      const meal1 = order.meals.find(x => x.name === meals[1]);
      const meal2 = order.meals.find(x => x.name === meals[2]);
      const meal3 = order.meals.find(x => x.name === meals[3]);
      const meal4 = order.meals.find(x => x.name === meals[4]);
      const meal5 = order.meals.find(x => x.name === meals[5]);

      let customerMeals = {
        [meals[0]]: meal0 ? meal0.qty : 0,
        [meals[1]]: meal1 ? meal1.qty : 0,
        [meals[2]]: meal2 ? meal2.qty : 0,
        [meals[3]]: meal3 ? meal3.qty : 0,
        [meals[4]]: meal4 ? meal4.qty : 0,
        [meals[5]]: meal5 ? meal5.qty : 0
      };

      const item = { customerKey, meals: customerMeals };

      if (satelliteGroups[satellitePickUp] === undefined) {
        satelliteGroups[satellitePickUp] = [item];
      } else {
        satelliteGroups[satellitePickUp].push(item);
      }
    });

    this.setState({ rows: satelliteGroups });
  };

  renderTable = key => {
    const { classes } = this.props;
    const rows = this.state.rows[key];

    return (
      <div>
        <Typography variant="headline" component="heading">
          {key}
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {meals.map(x => {
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
                return (
                  <TableRow key={row.customerKey}>
                    <TableCell component="th" scope="row">
                      {row.customerKey}
                    </TableCell>
                    <TableCell numeric>{row.meals[meals[0]]}</TableCell>
                    <TableCell numeric>{row.meals[meals[1]]}</TableCell>
                    <TableCell numeric>{row.meals[meals[2]]}</TableCell>
                    <TableCell numeric>{row.meals[meals[3]]}</TableCell>
                    <TableCell numeric>{row.meals[meals[4]]}</TableCell>
                    <TableCell numeric>{row.meals[meals[5]]}</TableCell>
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
    const { rows } = this.state;

    return (
      <React.Fragment>
        {Object.keys(rows).map(key => {
          return this.renderTable(key);
        })}
      </React.Fragment>
    );
  }
}

OrdersGroupedBySatellite.propTypes = propTypes;

export default withStyles(styles)(OrdersGroupedBySatellite);
