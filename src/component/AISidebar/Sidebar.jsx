import React, { useEffect } from "react";
import {
  MdOutlineAssignment,
  MdOutlineAssignmentLate,
  MdOutlineDashboard,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../Router/Navigation";
import Header from "../AIHeader/Header";
import { getCollocationMissingWordsList } from "../../Redux/Reducers/CollocationReducer";
import { useDispatch } from "react-redux";
import { IconsAI } from "../../assets/Icons";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    navigate("/");
  }, []);

  return (
    <div className="flex  ">
      <div
        className={`bg-Primary select-none h-screen w-52 duration-500 text-gray-100`}
      >
        <div className="h-16 border-b text-center flex justify-center  border-r items-center ">
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
              location.pathname === "/MissingWords" && "bg-Secondry"
            } cursor-pointer hover:bg-Secondry p-2 mt-1 mx-2 rounded-md`}
            onClick={() => {
              if (location.pathname !== "./MissingWords") {
                navigate("MissingWords");
                dispatch(getCollocationMissingWordsList());
              }
            }}
          >
            <MdOutlineAssignment />

            <div className="pl-2 font-USBold text-xs">Word List</div>
          </div>
          <div className="flex items-center cursor-pointer hover:bg-Secondry p-2 mt-2 mx-2 rounded-md">
            <MdOutlineAssignmentLate />
            <div className="pl-2  font-USBold text-xs">Removed Words</div>
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
