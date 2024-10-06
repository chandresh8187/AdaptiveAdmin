import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityIndicator from "./component/AIActivityIdicator/ActivityIndicator";
import Sidebar from "./component/AISidebar/Sidebar";
import Login from "./Pages/Login/Login";
import { setIdToken } from "./Redux/Reducers/AuthReducer";

function App() {
  const UserToken = useSelector((state) => state.Auth.IdToken);
  const [gettingUser, setgettingUser] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getLoggedUser = () => {
      const loggedUserToken = localStorage.getItem("Token");
      dispatch(setIdToken(JSON.parse(loggedUserToken)));
      setTimeout(() => {
        setgettingUser(false);
      }, 1000);
    };
    getLoggedUser();
  }, []);

  const RenderUIbassedOnAuth = () => {
    if (gettingUser) {
      return <ActivityIndicator />;
    }
    return UserToken === null ? <Login /> : <Sidebar />;
  };
  return <RenderUIbassedOnAuth />;
}

export default App;
