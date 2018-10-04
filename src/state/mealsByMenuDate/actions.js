import { mealsByMenuDateRef } from "../../config/firebase";
import { snapshotToArray } from "../../utils/firebaseUtils";
import * as types from "./types";

export const fetchMeals = () => {
  return dispatch => {
    mealsByMenuDateRef
      .once("value")
      .then(snapshot => {
        const data = snapshotToArray(snapshot);
        return data;
      })
      .then(meals => {
        dispatch({ type: types.FETCH_MEALS, meals });
      });
  };
};
