import { createReducer } from "../utils";
import * as types from "./types";

const initialState = [];

const customersReducer = createReducer(initialState)({
  [types.FETCH_CUSTOMERS]: (state, action) => {
    console.log("fetch_customer reducer");
    return action.customers || [];
  }
});

export default customersReducer;
