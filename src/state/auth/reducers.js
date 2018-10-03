import { createReducer } from "../utils";
import * as types from "./types";

const initialState = {
  user: null,
  error: null,
  allowedUsers: null
};

const authReducer = createReducer(initialState)({
  [types.FETCH_USER]: (state, action) => {
    return { ...state, user: action.payload || null };
  },
  [types.CLEAR_ERROR]: (state, action) => {
    return { ...state, error: null };
  },
  [types.SET_ERROR]: (state, action) => {
    return { ...state, error: action.payload };
  },
  [types.FETCH_ALLOWED_USERS]: (state, action) => {
    const { allowedUsers } = action;
    return { ...state, allowedUsers };
  }
});

export default authReducer;
