import { customersRef, notesRef } from "../../config/firebase";
import * as types from "./types";
import moment from "moment";
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

        return Promise.all(promises).then(() => {
          dispatch({ type: types.FETCH_CUSTOMERS, customers });
        });
      })
      .catch(err => {
        // dispatch({ type: types.SET_ERROR, payload: err });
        return err;
      });
  };
};

export const selectFirstTimeCustomers = (customers, menuDate) => {
  return dispatch => {
    // Get week range of menu date
    const menuDateRef = moment(menuDate);
    const nextMenuDate = menuDateRef
      .clone()
      .day(7) // Add a week
      .weekday(4); // Thursday, when menu's get published

    // Get both date values in milis
    const startTime = menuDateRef.startOf("day").valueOf();
    const endTime = nextMenuDate.valueOf();

    // Filter list by property firstOrderDate in range
    return customers.filter(
      customer =>
        customer.firstOrderDate &&
        customer.firstOrderDate >= startTime &&
        customer.firstOrderDate <= endTime
    );
  };
};
