import React from "react";
import fire from "../fire";
import snapshotToArray from "../utils/firebaseUtils";

export default class Customers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
  }

  componentDidMount() {
    const customersRef = fire
      .database()
      .ref("customers")
      .orderByKey();
    customersRef.once("value").then(snapshot => {
      const customers = snapshotToArray(snapshot);
      this.setState({ customers });
    });
  }

  render() {
    return (
      <div className="customers">
        <h1>
          Meal Plan Customers <small>{this.state.customers.length}</small>
        </h1>
        <ul>
          {this.state.customers.map(x => (
            <li key={x.key}>{x.name}</li>
          ))}
        </ul>
      </div>
    );
  }
}
