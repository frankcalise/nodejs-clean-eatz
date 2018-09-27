import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
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
      .orderByKey()
      .on("child_added", snapshot => {
        const data = snapshot.val();
        const transactionId = snapshot.key;
        let customerRef = fire.database().ref(`customers/${data.customerKey}`);
        customerRef.once("value").then(customerSnapshot => {
          const customer = customerSnapshot.val();
          const { name, phone, email } = customer;
          const order = {
            ...data,
            transactionId,
            customer: {
              name,
              phone,
              email
            }
          };

          this.setState({ data: this.state.data.concat([order]) });
        });
      });
  };

  render() {
    const orders = this.state.data.map(order => {
      return <MealCard key={order.transactionId} order={order} />;
    });

    return (
      <React.Fragment>
        <CssBaseline />
        <Typography variant="display1" gutterBottom>
          Meal Plan Orders
        </Typography>
        {orders}
      </React.Fragment>
    );
  }
}
