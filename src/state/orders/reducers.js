import { createReducer } from "../utils";
import * as types from "./types";

const initialState = null;

const ordersReducer = createReducer(initialState)({
  [types.FETCH_ORDERS]: (state, action) => {
    return action.orders || null;
  }
});

export default ordersReducer;
