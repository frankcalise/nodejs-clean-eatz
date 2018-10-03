import { createReducer } from "../utils";
import * as types from "./types";

const initialState = null;

const orderSummariesReducer = createReducer(initialState)({
  [types.FETCH_ORDER_SUMMARIES]: (state, action) => {
    console.log(action);
    return action.orderSummaries || null;
  }
});

export default orderSummariesReducer;
