import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import fire from "./fire";
import snapshotToArray from "./utils/firebaseUtils";

class App extends Component {
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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <h1>
            Meal Plan Customers <small>{this.state.customers.length}</small>
          </h1>
          <ul>
            {this.state.customers.map(x => (
              <li key={x.key}>{x.name}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
