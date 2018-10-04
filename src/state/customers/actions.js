import { customersRef } from "../../config/firebase";
import * as types from "./types";
import { snapshotToArray } from "../../utils/firebaseUtils";

export const fetchCustomers = () => {
  console.log("fetchCustomers");
  return dispatch => {
    return customersRef
      .orderByKey()
      .once("value")
      .then(snapshot => {
        const customers = snapshotToArray(snapshot);
        return customers;
      })
      .then(customers => {
        console.log(customers);
        dispatch({ types: types.FETCH_CUSTOMERS, customers });
      })
      .catch(err => {
        // dispatch({ type: types.SET_ERROR, payload: err });
        return err;
      });
  };
};
