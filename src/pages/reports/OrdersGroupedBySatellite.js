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
  "Bacon, Egg, Cheese Wrap",
  "Chicken Parm",
  "Paleo Chili",
  "Pork Loin",
  "Sweet Chili Shrimp",
  "BBQ Beef Sweet Potato"
];

class OrdersGroupedBySatellite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.runReport();
  }

  runReport = async () => {
    let orderKey = null;
    await fire
      .database()
      .ref("orders")
      .orderByKey()
      .limitToLast(1)
      .once("child_added", snapshot => {
        orderKey = snapshot.key;
      });

    await fire
      .database()
      .ref(`orders/${orderKey}`)
      .orderByChild("satellite")
      .equalTo(true)
      .on("child_added", snapshot => {
        const item = snapshot.val();
        item.key = snapshot.key;

        let customerRef = fire.database().ref(`customers/${item.customerKey}`);
        customerRef.once("value").then(customerSnapshot => {
          const customer = customerSnapshot.val();
          const { name, phone, email } = customer;

          const order = {
            ...item,
            customer: {
              name,
              phone,
              email
            }
          };

          this.setState({ data: this.state.data.concat([order]) });
        });
      });
  };

  renderTable = key => {
    const { classes } = this.props;
    const rows = this.state.data.filter(x => x.satellitePickUp === key);

    return (
      <div key={key}>
        <Typography variant="subheading">{key}</Typography>
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
                const meal0 = row.meals.find(x => x.name === meals[0]);
                const meal1 = row.meals.find(x => x.name === meals[1]);
                const meal2 = row.meals.find(x => x.name === meals[2]);
                const meal3 = row.meals.find(x => x.name === meals[3]);
                const meal4 = row.meals.find(x => x.name === meals[4]);
                const meal5 = row.meals.find(x => x.name === meals[5]);

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
    const groups = this.state.data
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
      <React.Fragment>
        <Typography variant="display1">
          Orders Grouped by Satellite Location
        </Typography>
        {groups.map(group => {
          return this.renderTable(group);
        })}
      </React.Fragment>
    );
  }
}

OrdersGroupedBySatellite.propTypes = propTypes;

export default withStyles(styles)(OrdersGroupedBySatellite);
