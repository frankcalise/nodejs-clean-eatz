import React from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MealCard from "../../components/MealCard";
import WithLoader from "../../components/WithLoader";
import { orderOperations } from "../../state/orders";

const getState = state => {
  return {
    orders: state.orders
  };
};

const getActions = dispatch => {
  return {
    fetchOrders: () => dispatch(orderOperations.fetchOrders())
  };
};

class Orders extends React.Component {
  state = {
    loaded: false
  };

  componentDidMount() {
    Promise.all([this.props.fetchOrders()])
      .then(() => {
        this.setState({ loaded: true });
      })
      .catch(err => {
        console.error(err);
        this.setState({ loaded: true });
      });
  }

  render() {
    const orders = this.props.orders
      .map(order => {
        return (
          <Grid item xs key={order.transactionKey}>
            <MealCard order={order} />
          </Grid>
        );
      })
      .reverse();

    let totalNumMeals = 0;
    this.props.orders.map(x => {
      let orderNumMeals = 0;
      x.meals.map(y => {
        return (orderNumMeals += y.qty);
      });
      return (totalNumMeals += orderNumMeals);
    });

    return (
      <WithLoader condition={this.state.loaded} message="Loading Orders">
        <CssBaseline />
        <Typography variant="display1">Meal Plan Orders</Typography>
        <Typography variant="subheading" gutterBottom>
          {orders.length} orders, {totalNumMeals} meals
        </Typography>
        <Grid container spacing={24}>
          {orders}
        </Grid>
      </WithLoader>
    );
  }
}

export default connect(
  getState,
  getActions
)(Orders);
