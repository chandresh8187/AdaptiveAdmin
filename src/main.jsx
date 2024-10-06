import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import RootIndicator from "./component/AIActivityIdicator/RootIndicator.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <AuthProvider>
          <App />
          <ToastContainer
            style={{ fontFamily: "USMedium" }}
            autoClose={2000}
            draggable
          />
          <Toaster />
          <RootIndicator />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
