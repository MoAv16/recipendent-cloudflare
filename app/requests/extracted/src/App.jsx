import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScreenOrders from "./pages/ScreenOrders.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ScreenOrders />} />
      </Routes>
    </Router>
  );
};

export default App;
