import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home/Home";
import WordsList from "../Pages/Collocations/WordsList";
import RemovedWords from "../Pages/Collocations/RemovedWords";
import Login from "../Pages/Login/Login";
function Navigation() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="WordsList" element={<WordsList />} />
      <Route path="RemovedWords" element={<RemovedWords />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default Navigation;
