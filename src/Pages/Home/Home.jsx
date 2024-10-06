import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../Redux/Reducers/AuthReducer";
import { Button } from "antd";
import { APIClient } from "../../API/ApiClient";
import useAuth from "../../context/AuthContext";

function Home() {
  const { Auth } = useAuth();
  const getAllCollections = async () => {
    let xapikey = localStorage.getItem("xapikey");
    console.log("xapikey", xapikey);
    const cookie = sessionStorage.getItem("session");
    console.log("cookie ss", cookie);
    const response = await fetch(
      "https://adaptiveielts.com:8383/vocabulary_collection_names",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "X-API-KEY": xapikey,
        },
      }
    );
    console.log("getAllCollections", response);
    console.log("getAllCollections json", await response.json());
  };
  const dispatch = useDispatch();
  return (
    <div>
      <Button
        danger
        type="text"
        onClick={async () => {
          await Auth.LogOutUser();
        }}
      >
        logout
      </Button>
      <Button
        onClick={() => {
          getAllCollections();
        }}
      >
        get list
      </Button>
    </div>
  );
}

export default Home;
