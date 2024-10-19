import { Button } from "antd";
import React, { useEffect } from "react";
import { MdOutlineAssignment, MdOutlineDashboard } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { IconsAI } from "../../assets/Icons";
import useAuth from "../../context/AuthContext";
import { getCollectionList } from "../../Redux/Reducers/CollocationReducer";
import Navigation from "../../Router/Navigation";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    navigate("/");
  }, []);
  const { Auth } = useAuth();
  const Logout = async () => {
    await Auth.LogOutUser();
  };
  return (
    <div className="flex">
      <div
        className={`bg-Primary select-none flex flex-col justify-between h-screen w-52 duration-500 text-gray-100`}
      >
        <div>
          <div className="h-16 border-b text-center flex justify-center  items-center ">
            <div className="bg-white object-contain p-2 rounded-md">
              <img
                height={20}
                className=""
                width={20}
                src={IconsAI.Logo}
                alt="ieltsLogo"
              />
            </div>
            <div className="text-sm ml-3 font-USSemiBold">AdaptiveIELTS</div>
          </div>

          <div className="py-2">
            <div
              style={{
                fontSize: 10,
                fontFamily: "USRegular",
              }}
              className="pl-4 mt-2"
            >
              GENERAL
            </div>
            <div
              className={`flex items-center ${
                location.pathname === "/" && "bg-Secondry"
              } cursor-pointer hover:bg-Secondry p-2 mt-1 mx-2 rounded-md`}
              onClick={() => {
                navigate("/");
              }}
            >
              {/* <img src={IconsAI.Dashboard} className="h-4 w-4" /> */}
              <MdOutlineDashboard />
              <div className="pl-2 font-USBold text-xs">Dashboard</div>
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "USRegular",
              }}
              className="pl-4 mt-5"
            >
              COLLOCATIONS
            </div>
            <div
              className={`flex items-center ${
                location.pathname === "/WordsList" && "bg-Secondry"
              } cursor-pointer hover:bg-Secondry p-2 mt-1 mx-2 rounded-md`}
              onClick={() => {
                if (location.pathname !== "./WordsList") {
                  navigate("WordsList");
                  dispatch(getCollectionList());
                }
              }}
            >
              <MdOutlineAssignment />

              <div className="pl-2 font-USBold text-xs">Word List</div>
            </div>
          </div>
        </div>
        <div className="w-52 flex border-t items-center justify-center py-3">
          <div
            onClick={async () => {
              await Logout();
            }}
            className={`flex items-center  cursor-pointer hover:bg-Secondry p-2 mt-1 mx-2 rounded-md`}
          >
            <img src={IconsAI.Logout} className="h-5 w-5" alt="" />

            <div className="pl-2 font-USBold text-xs">Logout</div>
          </div>
        </div>
      </div>
      <div className="w-full h-screen overflow-scroll bg-container">
        <Navigation />
      </div>
    </div>
  );
};

export default Sidebar;
