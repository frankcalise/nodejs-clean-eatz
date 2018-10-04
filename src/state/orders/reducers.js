import { createReducer } from "../utils";
import * as types from "./types";

const initialState = [];

const ordersReducer = createReducer(initialState)({
  [types.FETCH_ORDERS]: (state, action) => {
    return action.orders || [];
  }
});

export default ordersReducer;
