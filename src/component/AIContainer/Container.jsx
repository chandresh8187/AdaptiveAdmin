import React from "react";
import "./Container.css";
function Container({ children }) {
  return <div className="MainContainer">{children}</div>;
}

export default Container;
