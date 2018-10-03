import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MealCard from "../../components/MealCard";
import firebase from "../../config/firebase";

export default class Orders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    let parentOrderKey = null;
    await firebase
      .database()
      .ref("orders")
      .orderByKey()
      .limitToLast(1)
      .once("child_added", snapshot => {
        parentOrderKey = snapshot.key;
      });

    await firebase
      .database()
      .ref(`orders/${parentOrderKey}`)
      .orderByChild("orderDate")
      .on("child_added", snapshot => {
        const data = snapshot.val();
        const transactionId = snapshot.key;
        let customerRef = firebase
          .database()
          .ref(`customers/${data.customerKey}`);
        customerRef.once("value").then(customerSnapshot => {
          const customer = customerSnapshot.val();
          const { name, phone, email, firstTransactionId } = customer;
          let firstTimeCustomer = false;
          if (firstTransactionId) {
            if (firstTransactionId === transactionId) {
              firstTimeCustomer = true;
            }
          }
          const order = {
            ...data,
            transactionId,
            customer: {
              name,
              phone,
              email
            },
            firstTimeCustomer
          };

          this.setState({ data: this.state.data.concat([order]) });
        });
      });
  };

  render() {
    const orders = this.state.data
      .map(order => {
        return (
          <Grid item xs key={order.transactionId}>
            <MealCard order={order} />
          </Grid>
        );
      })
      .reverse();

    let totalNumMeals = 0;
    this.state.data.map(x => {
      let orderNumMeals = 0;
      x.meals.map(y => {
        return (orderNumMeals += y.qty);
      });
      return (totalNumMeals += orderNumMeals);
    });

    return (
      <React.Fragment>
        <CssBaseline />
        <Typography variant="display1">Meal Plan Orders</Typography>
        <Typography variant="subheading" gutterBottom>
          {orders.length} orders, {totalNumMeals} meals
        </Typography>
        <Grid container spacing={24}>
          {orders}
        </Grid>
      </React.Fragment>
    );
  }
}
