import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";

function App() {
  return (
    <div className="App">
      <div className="main-wrapper">
        <Router>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
export default App;
