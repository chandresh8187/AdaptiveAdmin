import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import AuthReducer from "./Reducers/AuthReducer";
import collocationsReducer from "./Reducers/CollocationReducer";
import TestReducer from "./Reducers/TestReducer";

const rootReducers = combineReducers({
  Test: TestReducer,
  Collocations: collocationsReducer,
  Auth: AuthReducer,
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
