import React from "react";
import firebase from "../../config/firebase";
import { encodeAsFirebaseKey } from "../../utils/firebaseUtils";

export default class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    };
  }

  componentDidMount() {
    this.getData(this.props.customerKey);
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps.customerKey);
  }

  getData = key => {
    const encodedKey = encodeAsFirebaseKey(key);
    firebase
      .database()
      .ref(`customers/${encodedKey}`)
      .once("value")
      .then(snapshot => {
        const customer = snapshot.val();
        const { name, phone, email } = customer;
        this.setState({
          data: {
            name,
            email,
            phone
          }
        });
      });
  };

  render() {
    if (this.state.data === null) {
      return <div className="customer-detail empty">Loading...</div>;
    }

    const { name, email, phone } = this.state.data;

    return (
      <div className="customer-detail">
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <p>Phone: {phone}</p>
      </div>
    );
  }
}
