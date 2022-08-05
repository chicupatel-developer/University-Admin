import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Department from "./components/Department/Department";
import Department_Create from "./components/Department_Create/Department_Create";
import Department_Edit from "./components/Department_Edit/Department_Edit";
import Department_Remove from "./components/Department_Remove/Department_Remove";
import UnAuth from "./components/UnAuth/UnAuth";
import NotFound from "./components/NotFound/NotFound";

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
            <Route path="/registration" element={<Registration />} />
            <Route path="/department" element={<Department />} />
            <Route path="/department-create" element={<Department_Create />} />
            <Route path="/department-edit/:id" element={<Department_Edit />} />
            <Route
              path="/department-remove/:id"
              element={<Department_Remove />}
            />
            <Route path="/un-auth" element={<UnAuth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
export default App;
