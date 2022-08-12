import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Student_Details = () => {
  let navigate = useNavigate();

  let { id } = useParams();

  // form
  const [student, setStudent] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      getStudent(id);
    }
  }, []);

  const getStudent = (id) => {
    if (checkForNumbersOnly(id)) {
      StudentService.getStudent(id)
        .then((response) => {
          console.log(response.data);
          setStudent(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      navigate("/student");
    }
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const convertGenderForDisplay = (genderCode) => {
    if (genderCode === 0) return "Male";
    else if (genderCode === 1) return "Female";
    else return "Other";
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-header header">
                <h3>Student # {id}</h3>
                <p></p>{" "}
              </div>
              <div className="card-body">student details</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Student_Details;
