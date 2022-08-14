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
import Faculty from "./components/Faculty/Faculty";
import Faculty_Create from "./components/Faculty_Create/Faculty_Create";
import Faculty_Edit from "./components/Faculty_Edit/Faculty_Edit";
import Faculty_Remove from "./components/Faculty_Remove/Faculty_Remove";
import Course from "./components/Course/Course";
import Course_Create from "./components/Course_Create/Course_Create";
import Course_Edit from "./components/Course_Edit/Course_Edit";
import Course_Remove from "./components/Course_Remove/Course_Remove";
import Assignment from "./components/Assignment/Assignment";
import Assignment_Create from "./components/Assignment_Create/Assignment_Create";
import Student from "./components/Student/Student";
import Student_Details from "./components/Student_Details/Student_Details";
import Student_Create from "./components/Student_Create/Student_Create";
import Student_Edit from "./components/Student_Edit/Student_Edit";
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
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/faculty-create" element={<Faculty_Create />} />
            <Route path="/faculty-edit/:id" element={<Faculty_Edit />} />
            <Route path="/faculty-remove/:id" element={<Faculty_Remove />} />
            <Route path="/course" element={<Course />} />
            <Route path="/course-create" element={<Course_Create />} />
            <Route path="/course-edit/:id" element={<Course_Edit />} />
            <Route path="/course-remove/:id" element={<Course_Remove />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/assignment-create" element={<Assignment_Create />} />
            <Route path="/student" element={<Student />} />
            <Route path="/student-details/:id" element={<Student_Details />} />
            <Route path="/student-create" element={<Student_Create />} />
            <Route path="/student-edit/:id" element={<Student_Edit />} />
            <Route path="/un-auth" element={<UnAuth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}
export default App;
