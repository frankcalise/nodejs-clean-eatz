import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import EnhancedTableHead from "../../components/EnhancedTableHead";
import WithLoader from "../../components/WithLoader";
import { getFirstTimeCustomers } from "../../state/customers/selectors";
import { fetchCustomers } from "../../state/customers/actions";

const propTypes = {
  classes: PropTypes.object.isRequired
};

// TODO move to store as menuDate
const today = moment();
let adjWeek = 0;
if (today.weekday() < 4) {
  adjWeek = -7;
}
const menuDate = moment()
  .day(adjWeek)
  .weekday(4)
  .startOf("day");

const getState = state => ({
  customers: state.customers,
  firstTimeCustomers: getFirstTimeCustomers(state.customers, menuDate)
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
    disablePadding: true,
    label: "Name",
    isSortable: true
  },
  {
    id: "firstOrderDate",
    numeric: false,
    disablePadding: true,
    label: "First Order Date",
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

class FirstTimeCustomers extends React.Component {
  state = {
    loaded: false,
    order: "asc",
    orderBy: "firstOrderDate"
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

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { classes, firstTimeCustomers } = this.props;
    const { order, orderBy, loaded } = this.state;

    return (
      <WithLoader condition={loaded} message="Searching First Time Customers">
        <Typography variant="display1">First Time Customers</Typography>
        <Typography variant="subheading" gutterBottom>
          Menu of {moment(this.state.menuDate).format("MM/DD/YYYY")},{" "}
          {firstTimeCustomers.length} new customers
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
              {stableSort(firstTimeCustomers, getSorting(order, orderBy)).map(
                customer => {
                  return (
                    <TableRow key={customer.key}>
                      <TableCell component="th" scope="row">
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.firstOrderDate}</TableCell>
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

FirstTimeCustomers.propTypes = propTypes;

export default connect(
  getState,
  getActions
)(withStyles(styles)(FirstTimeCustomers));
