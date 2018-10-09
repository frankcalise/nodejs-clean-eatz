import { createReducer } from "../utils";

const initialState = {
  searchFilter: ""
};

const searchReducer = createReducer(initialState)({
  "search/SEARCH_FILTER": (state, action) => {
    return {
      ...state,
      searchFilter: action.searchFilter
    };
  }
});

export default searchReducer;
