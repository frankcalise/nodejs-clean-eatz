import { createReducer } from "../utils";
import * as types from "./types";

const initialState = [];

const mealsByMenuDateReducer = createReducer(initialState)({
  [types.FETCH_MEALS]: (state, action) => {
    return action.meals || [];
  }
});

export default mealsByMenuDateReducer;
