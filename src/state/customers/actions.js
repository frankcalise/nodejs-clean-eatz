import { customersRef } from "../../config/firebase";
import * as types from "./types";

export const fetchCustomers = () => {
  return dispatch => {
    // return ordersRef
    //   .orderByKey()
    //   .once("value")
    //   .then(snapshot => {
    //     const orderSummaries = [];
    //     snapshot.forEach(childSnapshot => {
    //       const summary = childSnapshot.val();
    //       const { menuDate, numMeals, orderCount, meals } = summary;
    //       const mealsData = [];
    //       // not all orderSummary items have meals key
    //       if (meals) {
    //         Object.keys(meals).forEach(mealKey => {
    //           mealsData.push({ name: mealKey, ...meals[mealKey] });
    //         });
    //       }
    //       orderSummaries.push({
    //         menuDate,
    //         numMeals,
    //         orderCount,
    //         meals: mealsData
    //       });
    //     });
    //     return orderSummaries;
    //   })
    //   .then(orderSummaries => {
    //     dispatch({ type: types.FETCH_ORDER_SUMMARIES, orderSummaries });
    //   })
    //   .catch(err => {
    //     // dispatch({ type: types.SET_ERROR, payload: err });
    //     return err;
    //   });
  };
};
