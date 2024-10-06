import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logoutUser } from "../Redux/Reducers/AuthReducer";

export const AuthContext = createContext(null);

// Override the global console object

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const firebaseConfig = {
    apiKey: "AIzaSyC9hEXoQsTWm2ngIR32ZTeqzd-1qpptU_A",
    authDomain: "eielts-28f1a.firebaseapp.com",
    projectId: "eielts-28f1a",
    storageBucket: "eielts-28f1a.appspot.com",
    messagingSenderId: "167786179874",
    appId: "1:167786179874:web:b23b3f6193febb209c897b",
    measurementId: "G-8D2QFG6LLX",
  };
  const app = initializeApp(firebaseConfig);
  const Auth = getAuth(app);

  const LogOutUser = async () => {
    signOut(Auth)
      .then(() => {
        // Sign-out successful.
        dispatch(logoutUser());
      })
      .catch((error) => {
        // An error happened.
      });
  };

  Auth.LogOutUser = LogOutUser;

  return (
    <AuthContext.Provider value={{ Auth }}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);
export default useAuth;
