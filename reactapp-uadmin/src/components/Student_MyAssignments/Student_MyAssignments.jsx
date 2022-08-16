import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";

import { useNavigate, useLocation } from "react-router";

import Moment from "moment";

const Student_MyAssignments = () => {
  let navigate = useNavigate();
  // let { id } = useParams();

  const { state } = useLocation();
  const { studentId, firstName, lastName, courseId } = state; // Read values passed on state

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Student"))
      navigate("/un-auth");
    else {
      console.log(studentId, firstName, lastName, courseId);
    }
  }, []);

  return (
    <div className="container">
      <div className="mainHeader">My-Assignments</div>
      <p></p>
      <div className="row">
        <div className="col-md-3 mx-auto"></div>
        <div className="col-md-6 mx-auto">
          <div className="studentHeader">
            # {studentId} ) {firstName},{" "}
            {lastName}
          </div>
        </div>
        <div className="col-md-3 mx-auto"></div>
      </div>
      <p></p>
     
    </div>
  );
};

export default Student_MyAssignments;
