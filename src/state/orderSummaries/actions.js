import firebase from "../../config/firebase";
import * as types from "./types";

export const fetchOrderSummaries = () => {
  return dispatch => {
    return firebase
      .database()
      .ref("orderSummaries")
      .orderByKey()
      .once("value")
      .then(snapshot => {
        const orderSummaries = [];
        snapshot.forEach(childSnapshot => {
          const summary = childSnapshot.val();
          const { menuDate, numMeals, orderCount, meals } = summary;

          const mealsData = [];

          // not all orderSummary items have meals key
          if (meals) {
            Object.keys(meals).forEach(mealKey => {
              const { total } = meals[mealKey];
              mealsData.push({ name: mealKey, total });
            });
          }

          orderSummaries.push({
            menuDate,
            numMeals,
            orderCount,
            meals: mealsData
          });

          console.log(menuDate);
        });

        return orderSummaries;
      })
      .then(orderSummaries => {
        dispatch({ type: types.FETCH_ORDER_SUMMARIES, orderSummaries });
      })
      .catch(err => {
        // dispatch({ type: types.SET_ERROR, payload: err });
        console.log(err);
        return err;
      });
  };
};
