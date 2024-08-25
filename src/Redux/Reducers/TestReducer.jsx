const initialState = {
  count: 1,
};

export const setCount = (count) => ({
  type: "SET_COUNT",
  payload: count,
});

function TestReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_COUNT":
      return { ...state, count: action.payload };
    default:
      return state;
  }
}

export default TestReducer;
