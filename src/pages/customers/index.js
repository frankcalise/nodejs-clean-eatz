import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import WithLoader from "../../components/WithLoader";
import SimpleModal from "../../components/SimpleModal";
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
    width: 275,
    height: 175
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
    loaded: false,
    hasNotes: false,
    showNotes: false,
    selectedCustomer: null
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
    )
      .filter(x => (this.state.hasNotes ? x.notes !== null : true))
      .map(customer => {
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

              <CardActions>
                {customer.notes && (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                      this.setState({
                        showNotes: true,
                        selectedCustomer: customer
                      });
                    }}
                  >
                    Notes ({Object.keys(customer.notes).length})
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        );
      });

    return (
      <WithLoader condition={this.state.loaded} message="Loading Customers">
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.hasNotes}
              onChange={() => {
                this.setState({ hasNotes: !this.state.hasNotes });
              }}
              value="hasNotes"
              color="primary"
            />
          }
          label="Has notes"
        />
        <Grid container spacing={8}>
          {filteredCustomers}
        </Grid>
        {this.state.showNotes && (
          <SimpleModal
            open={this.state.showNotes}
            handleClose={() => {
              this.setState({ showNotes: false, selectedCustomer: null });
            }}
            title={this.state.selectedCustomer.name}
            subtitle="Notes"
          >
            {Object.values(this.state.selectedCustomer.notes).map(x => {
              return (
                <React.Fragment>
                  <Typography component="p">{x.note}</Typography>
                  <Typography color="textSecondary">
                    {x.author} {bull}{" "}
                    {moment(x.timestamp).format("MM/DD/YYY HH:mm A")}
                  </Typography>
                </React.Fragment>
              );
            })}
          </SimpleModal>
        )}
      </WithLoader>
    );
  }
}

Customers.propTypes = propTypes;

export default connect(
  getState,
  getActions
)(withStyles(styles)(Customers));
