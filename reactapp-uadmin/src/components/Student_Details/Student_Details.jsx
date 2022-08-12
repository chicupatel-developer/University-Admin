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
  const [displayClass, setDisplayClass] = useState("");

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
          getDisplayClass(response.data.gender);
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
  const handleNullValue = (value) => {
    if (value === null || value === "") return "N/A";
    else return value;
  };
  const getDisplayClass = (value) => {
    console.log(value);
    if (value === 0) setDisplayClass("maleGender");
    else if (value === 1) setDisplayClass("femaleGender");
    else setDisplayClass("otherGender");
    console.log(displayClass);
  };

  const editStudent = (e, stdId) => {
    console.log("edit student : ", stdId);
    navigate("/student-edit/" + stdId);
  };
  const removeStudent = (e, stdId) => {
    console.log("remove student : ", stdId);
    navigate("/student-remove/" + stdId);
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-header header">
                <div className="row">
                  <div className="col-md-7 mx-auto">
                    <h3>Student # {id}</h3>
                  </div>
                  <div className="col-md-5 mx-auto">
                    <Button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => editStudent(e, id)}
                    >
                      <i className="bi bi-pencil-square"></i> Student
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      className="btn btn-danger"
                      type="button"
                      onClick={(e) => removeStudent(e, id)}
                    >
                      <i className="bi bi-trash"></i> Student
                    </Button>
                  </div>
                </div>
                <p></p>{" "}
              </div>
              <div className={`card-body ${displayClass}`}>
                <div className="row">
                  <div className="col-md-3 mx-auto">Student #</div>
                  <div className="col-md-9 mx-auto">{student.studentId}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-3 mx-auto">First Name</div>
                  <div className="col-md-9 mx-auto">{student.firstName}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-3 mx-auto">Last Name</div>
                  <div className="col-md-9 mx-auto">{student.lastName}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-3 mx-auto">Email</div>
                  <div className="col-md-9 mx-auto">{student.email}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-3 mx-auto">Phone</div>
                  <div className="col-md-9 mx-auto">{student.phoneNumber}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-3 mx-auto">Gender</div>
                  <div className="col-md-9 mx-auto">
                    {convertGenderForDisplay(student.gender)}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-3 mx-auto">Home Address</div>
                  <div className="col-md-9 mx-auto">
                    {handleNullValue(student.homeAddress)}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-3 mx-auto">Home Postal</div>
                  <div className="col-md-9 mx-auto">
                    {handleNullValue(student.homePostalCode)}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-3 mx-auto">Mail Address</div>
                  <div className="col-md-9 mx-auto">
                    {handleNullValue(student.mailAddress)}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-3 mx-auto">Mail Postal</div>
                  <div className="col-md-9 mx-auto">
                    {handleNullValue(student.mailPostalCode)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Student_Details;
