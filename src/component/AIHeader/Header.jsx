import React from "react";

function Header({ title = "/title" }) {
  const route = {
    "/": "DashBoard",
    "/MissingWords": "Collocations",
  };
  return (
    <header className="border-b  bg-white flex items-center h-16 pl-5">
      <div className="text-TextPrimary text-lg  font-USBold ml-2 mt-1">
        {route[title]}
      </div>
    </header>
  );
}

export default Header;
