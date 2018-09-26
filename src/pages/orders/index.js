import React from "react";
import { snapshotToArray } from "../../utils/firebaseUtils";
import fire from "../../utils/fire";
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

  getCustomerMeta = async customerKey => {
    await fire
      .database()
      .ref(`customers/${customerKey}`)
      .once("value")
      .then(customerSnapshot => {
        const customer = customerSnapshot.val();
        console.log(customer);
        const { name, phone, email } = customer;
        const customerMeta = {
          name,
          phone,
          email
        };
      });
  };

  getData = async () => {
    const orderData = [];
    await fire
      .database()
      .ref("orders")
      .orderByKey()
      .limitToLast(1)
      .once("value")
      .then(snapshot => {
        const data = snapshotToArray(snapshot);
        const orderKeys = Object.keys(data[0]).filter(x => x !== "key");

        for (const orderKey of orderKeys) {
          const order = data[0][orderKey];
          console.log(order);
          const customerKey = order.customerKey;

          const customerMeta = this.getCustomerMeta(customerKey);

          orderData.push(order);
        }

        this.setState({ data: orderData });
      });
  };

  render() {
    return <div className="orders">current orders</div>;
  }
}
