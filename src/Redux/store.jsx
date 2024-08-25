import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import TestReducer from "./Reducers/TestReducer";
import collocationsReducer from "./Reducers/CollocationReducer";

const rootReducers = combineReducers({
  Test: TestReducer,
  Collocations: collocationsReducer,
});

const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(thunk),

  // You can add middleware and other store enhancers here
});
export default store;
