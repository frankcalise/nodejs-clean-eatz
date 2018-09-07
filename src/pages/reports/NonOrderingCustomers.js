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
import fire from "../../fire";

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

class NonOrderingCustomers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      daysSinceLastOrder: 30,
      rows: []
    };
  }

  componentDidMount() {
    this.runReport();
  }

  runReport = () => {
    const { daysSinceLastOrder } = this.state;
    fire
      .database()
      .ref("customers")
      .orderByKey()
      .once("value")
      .then(snapshot => {
        const rows = [];

        snapshot.forEach(childSnapshot => {
          const customer = childSnapshot.val();
          const customerKey = childSnapshot.key;

          const { name, phone, email, lastOrderDate } = customer;
          const momentRef = moment(lastOrderDate);
          const timeAgo = moment()
            .subtract(daysSinceLastOrder, "days")
            .startOf("day");

          if (momentRef.isAfter(timeAgo) === false) {
            rows.push({
              customerKey,
              name,
              phone,
              email,
              lastOrderDate: momentRef.format("MM/DD/YYYY")
            });
          }
        });

        this.setState({ rows });
      });
  };

  render() {
    const { classes } = this.props;
    const { rows, daysSinceLastOrder } = this.state;

    return (
      <Paper className={classes.root}>
        <Typography variant="headline" component="heading">
          Non Ordering Customers
        </Typography>
        <Typography variant="subheading" gutterBottom>
          Last {daysSinceLastOrder} days
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Last Order Date</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => {
              return (
                <TableRow key={row.customerKey}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.lastOrderDate}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

NonOrderingCustomers.propTypes = propTypes;

export default withStyles(styles)(NonOrderingCustomers);
