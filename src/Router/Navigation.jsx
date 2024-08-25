import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home/Home";
import MissingWords from "../Pages/Collocations/MissingWords";
import RemovedWords from "../Pages/Collocations/RemovedWords";
function Navigation() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="MissingWords" element={<MissingWords />} />
      <Route path="RemovedWords" element={<RemovedWords />} />
    </Routes>
  );
}

export default Navigation;
