import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import EnhancedTableHead from "../../components/EnhancedTableHead";
import WithLoader from "../../components/WithLoader";
import { getNonOrderingCustomers } from "../../state/customers/selectors";
import { fetchCustomers } from "../../state/customers/actions";

const propTypes = {
  classes: PropTypes.object.isRequired
};

const getState = state => ({
  customers: state.customers,
  nonOrderingCustomers: getNonOrderingCustomers(state.customers, 30)
});

const getActions = {
  fetchCustomers
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
    disablePadding: false,
    label: "Name",
    isSortable: true
  },
  {
    id: "lastOrderDate",
    numeric: false,
    disablePadding: false,
    label: "Last Order Date",
    isSortable: true
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email"
  },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
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
  state = {
    daysSinceLastOrder: 30,
    order: "asc",
    orderBy: "lastOrderDate"
  };

  componentDidMount() {
    // run get customers if haven't retrieved
    console.log(this.props);
    if (this.props.customers.length === 0) {
      Promise.all([this.props.fetchCustomers()])
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

  // runReport = () => {
  //   const { daysSinceLastOrder } = this.state;
  //   firebase
  //     .database()
  //     .ref("customers")
  //     .orderByKey()
  //     .once("value")
  //     .then(snapshot => {
  //       const rows = [];

  //       snapshot.forEach(childSnapshot => {
  //         const customer = childSnapshot.val();
  //         const customerKey = childSnapshot.key;

  //         const { name, phone, email, lastOrderDate } = customer;
  //         const momentRef = moment(lastOrderDate);
  //         const timeAgo = moment()
  //           .subtract(daysSinceLastOrder, "days")
  //           .startOf("day");

  //         if (momentRef.isAfter(timeAgo) === false) {
  //           rows.push({
  //             customerKey,
  //             name,
  //             phone,
  //             email,
  //             lastOrderDate: momentRef.format("MM/DD/YYYY")
  //           });
  //         }
  //       });

  //       this.setState({ rows });
  //     });
  // };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { classes, nonOrderingCustomers } = this.props;
    const { daysSinceLastOrder, order, orderBy, loaded } = this.state;

    return (
      <WithLoader condition={loaded} message="Searching Non-ordering Customers">
        <Typography variant="display1" component="heading">
          Non Ordering Customers
        </Typography>
        <Typography variant="subheading" gutterBottom>
          Have not ordered in {daysSinceLastOrder} days,{" "}
          {nonOrderingCustomers.length} total customers
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
              {stableSort(nonOrderingCustomers, getSorting(order, orderBy)).map(
                customer => {
                  return (
                    <TableRow key={customer.key}>
                      <TableCell component="th" scope="row">
                        {customer.name}
                      </TableCell>
                      <TableCell>
                        {moment(customer.lastOrderDate).format(
                          "MM/DD/YYYY hh:mm A"
                        )}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </Paper>
      </WithLoader>
    );
  }
}

NonOrderingCustomers.propTypes = propTypes;

export default connect(
  getState,
  getActions
)(withStyles(styles)(NonOrderingCustomers));
