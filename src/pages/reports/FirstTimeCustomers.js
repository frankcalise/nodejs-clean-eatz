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
  constructor(props) {
    super(props);

    const today = moment();
    let adjWeek = 0;
    if (today.weekday() < 4) {
      adjWeek = -7;
    }
    const menuDate = moment()
      .day(adjWeek)
      .weekday(4)
      .startOf("day");

    this.state = {
      menuDate,
      rows: [],
      order: "asc",
      orderBy: "firstOrderDate"
    };
  }

  componentDidMount() {
    this.runReport();
  }

  runReport = () => {
    fire
      .database()
      .ref("customers")
      .orderByChild("firstOrderDate")
      .startAt(this.state.menuDate.valueOf())
      .once("value")
      .then(snapshot => {
        const rows = [];

        snapshot.forEach(childSnapshot => {
          const customer = childSnapshot.val();
          const customerKey = childSnapshot.key;

          const { name, phone, email, firstOrderDate } = customer;
          const momentRef = moment(firstOrderDate);

          rows.push({
            customerKey,
            name,
            phone,
            email,
            firstOrderDate: momentRef.format("MM/DD/YYYY hh:mm:ss A")
          });

          this.setState({ rows });
        });
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
    const { rows, order, orderBy } = this.state;

    return (
      <React.Fragment>
        <Typography variant="display1" component="heading">
          First Time Customers
        </Typography>
        <Typography variant="subheading" gutterBottom>
          Menu of {moment(this.state.menuDate).format("MM/DD/YYYY")}
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
                    <TableCell>{row.firstOrderDate}</TableCell>
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

FirstTimeCustomers.propTypes = propTypes;

export default withStyles(styles)(FirstTimeCustomers);
