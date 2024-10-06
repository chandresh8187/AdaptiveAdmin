import { setLoading } from "../../API/LoadingManager";
import { setRootLoading } from "../../API/RootLoadingManager";

const initialState = {
  user: null,
  IdToken: "",
};

export const setUser = (user) => {
  return async (dispatch) => {
    setRootLoading(true);
    dispatch({
      type: "SET_USER",
      payload: user,
    });

    localStorage.setItem("user", JSON.stringify(user));
    setTimeout(() => {
      setRootLoading(false);
    }, 1000);
  };
};

export const setIdToken = (token) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_ID_TOKEN",
      payload: token,
    });
    localStorage.setItem("Token", JSON.stringify(token));
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    setRootLoading(true);
    dispatch({
      type: "SET_USER",
      payload: null,
    });
    dispatch({
      type: "SET_ID_TOKEN",
      payload: null,
    });
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
    setTimeout(() => {
      setRootLoading(false);
    }, 1000);
  };
};

function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_ID_TOKEN":
      return { ...state, IdToken: action.payload };
    default:
      return state;
  }
}

export default AuthReducer;
