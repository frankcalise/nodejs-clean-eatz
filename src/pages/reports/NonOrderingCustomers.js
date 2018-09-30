import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import EnhancedTableHead from "../../components/EnhancedTableHead";
import firebase from "../../config/firebase";

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

const cols = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
    isSortable: true
  },
  {
    id: "lastOrderDate",
    numeric: false,
    disablePadding: true,
    label: "Last Order Date",
    isSortable: true
  },
  {
    id: "email",
    numeric: false,
    disablePadding: true,
    label: "Email"
  },
  {
    id: "phone",
    numeric: false,
    disablePadding: true,
    label: "Phone"
  }
];

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

class NonOrderingCustomers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      daysSinceLastOrder: 30,
      rows: [],
      order: "asc",
      orderBy: "lastOrderDate"
    };
  }

  componentDidMount() {
    this.runReport();
  }

  runReport = () => {
    const { daysSinceLastOrder } = this.state;
    firebase
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

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { classes } = this.props;
    const { rows, daysSinceLastOrder, order, orderBy } = this.state;

    return (
      <React.Fragment>
        <Typography variant="display1" component="heading">
          Non Ordering Customers
        </Typography>
        <Typography variant="subheading" gutterBottom>
          Have not ordered in {daysSinceLastOrder} days, {rows.length} total
          customers
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              cols={cols}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy)).map(row => {
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
      </React.Fragment>
    );
  }
}

NonOrderingCustomers.propTypes = propTypes;

export default withStyles(styles)(NonOrderingCustomers);
