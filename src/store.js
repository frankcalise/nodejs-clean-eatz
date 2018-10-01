import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import * as reducers from "./state";

const configureStore = initialState => {
  const rootReducer = combineReducers(reducers);
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middleware = applyMiddleware(thunkMiddleware);

  return createStore(rootReducer, initialState, composeEnhancers(middleware));
};

export default configureStore;
