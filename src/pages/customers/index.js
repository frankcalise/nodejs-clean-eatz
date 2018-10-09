import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import WithLoader from "../../components/WithLoader";
import { fetchCustomers } from "../../state/customers/actions";

const propTypes = { classes: PropTypes.object.isRequired };

const getState = state => ({
  customers: state.customers,
  searchFilter: state.search.searchFilter
});

const getActions = {
  fetchCustomers
};

const styles = theme => ({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  }
});

class Customers extends React.Component {
  state = {
    loaded: false
  };

  componentDidMount() {
    Promise.all([this.props.fetchCustomers()])
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loaded: true });
      });
  }

  render() {
    const { classes, searchFilter, customers } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const filteredCustomers = (searchFilter !== ""
      ? customers.filter(x => x.name.toLowerCase().indexOf(searchFilter) >= 0)
      : customers
    ).map(customer => {
      return (
        <Grid item xs key={customer.key}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="headline" component="h2">
                {customer.name}
              </Typography>
              <Typography component="p">
                {customer.email}
                <br />
                {customer.phone}
              </Typography>
              <Typography component="p">
                Orders {bull}{" "}
                {customer.orders ? Object.keys(customer.orders).length : "0"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    });

    return (
      <WithLoader condition={this.state.loaded} message="Loading Customers">
        <Grid container spacing={8}>
          {filteredCustomers}
        </Grid>
      </WithLoader>
    );
  }
}

Customers.propTypes = propTypes;

export default connect(
  getState,
  getActions
)(withStyles(styles)(Customers));
