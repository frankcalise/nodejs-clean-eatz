import { ordersRef, customersRef } from "../../config/firebase";
import * as types from "./types";

export const fetchOrders = () => {
  return dispatch => {
    const orders = [];

    return ordersRef
      .orderByKey()
      .limitToLast(1)
      .once("value")
      .then(snapshot => {
        const orderLookup = snapshot.val();
        const orderKey = Object.keys(orderLookup)[0];
        const transactions = orderLookup[orderKey];
        const transactionKeys = Object.keys(transactions);

        const promises = transactionKeys.map(transactionKey => {
          const data = transactions[transactionKey];
          return customersRef
            .child(data.customerKey)
            .once("value")
            .then(customerSnapshot => {
              const customerVal = customerSnapshot.val();
              const { name, phone, email, firstTransactionId } = customerVal;
              let firstTimeCustomer = false;
              if (firstTransactionId) {
                if (firstTransactionId === transactionKey) {
                  firstTimeCustomer = true;
                }
              }

              return { customer: { name, phone, email }, firstTimeCustomer };
            })
            .then(customer => {
              orders.push({ ...data, ...customer, transactionKey });
            });
        });

        Promise.all(promises).then(() => {
          dispatch({ type: types.FETCH_ORDERS, orders });
        });
      })
      .catch(err => {
        // dispatch({ type: types.SET_ERROR, payload: err });
        console.log(err);
        return err;
      });
  };
};
