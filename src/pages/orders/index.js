import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import fire from "../../utils/fire";
import MealCard from "../../components/MealCard";

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
    const orders = [];
    let parentOrderKey = null;
    await fire
      .database()
      .ref("orders")
      .orderByKey()
      .limitToLast(1)
      .once("child_added", snapshot => {
        parentOrderKey = snapshot.key;
      });

    await fire
      .database()
      .ref(`orders/${parentOrderKey}`)
      .orderByChild("orderDate")
      .on("child_added", snapshot => {
        const data = snapshot.val();
        const transactionId = snapshot.key;
        let customerRef = fire.database().ref(`customers/${data.customerKey}`);
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

    return (
      <React.Fragment>
        <CssBaseline />
        <Typography variant="display1" gutterBottom>
          Meal Plan Orders
        </Typography>
        <Grid container spacing={24}>
          {orders}
        </Grid>
      </React.Fragment>
    );
  }
}
