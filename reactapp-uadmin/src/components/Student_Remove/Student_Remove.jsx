import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";

import { useNavigate } from "react-router";

import Moment from "moment";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const Faculty_Remove = () => {
  let navigate = useNavigate();

  let { id } = useParams();
  const [getStudentError, setGetStudentError] = useState("");
  const [displayContentColor, setDisplayContentColor] = useState("");

  const [student, setStudent] = useState({});
  const [studentRemoveResponse, setStudentRemoveResponse] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else initializeRemoveStudent(id);
  }, []);

  const initializeRemoveStudent = (id) => {
    console.log("Initializing Student Remove Process : ", id);
    if (checkForNumbersOnly(id)) {
      setGetStudentError("");
      StudentService.initializeRemoveStudent(id)
        .then((response) => {
          console.log(response.data);
          setStudent(response.data);
          // if safe to remove, means no dependancy then green
          if (response.data.errorCode >= 0) {
            setDisplayContentColor("green");
          }
          // else not safe to remove, means dependancy then red
          else {
            setDisplayContentColor("red");
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            setGetStudentError(error.response.data);
          } else console.log(error);
        });
    } else navigate("/student");
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const removeStudent = (e) => {
    e.preventDefault();

    console.log("removing student: ", getStudentError);
    console.log("removing student-id: ", id);

    // api call
    StudentService.removeStudent(student)
      .then((response) => {
        console.log(response.data);
        var studentRemoveResponse = {
          responseCode: response.data.responseCode,
          responseMessage: response.data.responseMessage,
        };
        setStudentRemoveResponse(studentRemoveResponse);
        // 0: success
        if (response.data.responseCode === 0) {
          setTimeout(() => {
            navigate("/student");
          }, 3000);
        }
        // -1: fail
        else {
        }
      })
      .catch((error) => {
        setStudentRemoveResponse(error);
      });
  };

  const goBack = (e) => {
    navigate("/student");
  };

  const assignmentColumns = [
    {
      dataField: "assignmentId",
      text: "#",
    },
    {
      dataField: "asmtTitle",
      text: "Title",
    },
    {
      dataField: "asmtDetails",
      text: "Details",
    },
  ];

  const courseColumns = [
    {
      dataField: "courseId",
      text: "#",
    },
    {
      dataField: "courseName",
      text: "Course",
    },
  ];

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-10 mx-auto">
                    <h3>Remove Student</h3>
                    {!getStudentError && (
                      <h5>
                        <span className="headerText">
                          Are you sure wants to remove student?
                        </span>
                      </h5>
                    )}
                  </div>
                  <div className="col-md-2 mx-auto">
                    <Button
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => goBack(e)}
                    >
                      <i className="bi bi-arrow-return-left"></i> Back
                    </Button>
                  </div>
                </div>
                <p></p>{" "}
                {studentRemoveResponse &&
                studentRemoveResponse.responseCode === -1 ? (
                  <span className="studentRemoveError">
                    {studentRemoveResponse.responseMessage}
                  </span>
                ) : (
                  <span className="studentRemoveSuccess">
                    {studentRemoveResponse.responseMessage}
                  </span>
                )}
              </div>

              <div className="card-body">
                {!getStudentError ? (
                  <div style={{ color: displayContentColor }}>
                    <div className="container">
                      <h6>Student # : {student.studentId}</h6>
                      <h6>Student Name : {student.studentName}</h6>
                      <h6>API Code : {student.errorCode}</h6>
                      <div>
                        <h6>
                          API Message : {student.errorMessage}
                          <p></p>
                          {student.errorCode < 0 ? (
                            <Button
                              className="btn btn-danger"
                              type="button"
                              onClick={(e) => removeStudent(e)}
                            >
                              Force Remove Student
                            </Button>
                          ) : (
                            <Button
                              className="btn btn-primary"
                              type="button"
                              onClick={(e) => removeStudent(e)}
                            >
                              Remove Student
                            </Button>
                          )}
                        </h6>
                      </div>
                      <hr />
                      <h5>
                        <u>Depending Assignments...</u>
                      </h5>
                      <div>
                        {student.assignments &&
                        student.assignments.length > 0 ? (
                          <BootstrapTable
                            bootstrap4
                            keyField="assignmentId"
                            data={student.assignments}
                            columns={assignmentColumns}
                          />
                        ) : (
                          <div className="noData">No Assignments!</div>
                        )}
                      </div>

                      <h5>
                        <u>Depending Courses...</u>
                      </h5>
                      <div>
                        {student.courses && student.courses.length > 0 ? (
                          <BootstrapTable
                            bootstrap4
                            keyField="courseId"
                            data={student.courses}
                            columns={courseColumns}
                          />
                        ) : (
                          <div className="noData">No Courses!</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="studentRemoveError">{getStudentError}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faculty_Remove;
