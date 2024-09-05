import React from "react";

function Header({ title = "/title" }) {
  const route = {
    "/": "DashBoard",
    "/MissingWords": "Collocations",
  };
  return (
    <header className="border-b rounded-lg bg-white flex items-center mb-2 h-14 pl-5">
      <div className="text-TextPrimary text-lg  font-USBold ml-2 ">
        {route[title]}
      </div>
    </header>
  );
}

export default Header;
