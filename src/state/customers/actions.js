import { customersRef, notesRef } from "../../config/firebase";
import * as types from "./types";
import { snapshotToArray } from "../../utils/firebaseUtils";

export const fetchCustomers = () => {
  return dispatch => {
    return customersRef
      .orderByKey()
      .once("value")
      .then(snapshot => {
        const customers = snapshotToArray(snapshot);

        const promises = customers.map(customer => {
          return notesRef
            .child(customer.key)
            .once("value")
            .then(notesSnapshot => {
              const notesVal = notesSnapshot.val();
              customer.notes = notesVal;
            });
        });

        Promise.all(promises).then(() => {
          dispatch({ type: types.FETCH_CUSTOMERS, customers });
        });
      })
      .catch(err => {
        // dispatch({ type: types.SET_ERROR, payload: err });
        return err;
      });
  };
};
