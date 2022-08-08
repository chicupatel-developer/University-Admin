import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import DepartmentService from "../../services/department.service";
import FacultyService from "../../services/faculty.service";

import { useNavigate } from "react-router";

import Moment from "moment";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const Faculty_Remove = () => {
  let navigate = useNavigate();

  let { id } = useParams();
  const [getFacError, setGetFacError] = useState("");
  const [displayContentColor, setDisplayContentColor] = useState("");

  const [fac, setFac] = useState({ facultyRemove: {} });
  const [facRemoveResponse, setFacRemoveResponse] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else initializeRemoveFaculty(id);
  }, []);

  const initializeRemoveFaculty = (id) => {
    console.log("Initializing Faculty Remove Process : ", id);
    if (checkForNumbersOnly(id)) {
      setGetFacError("");
      FacultyService.initializeRemoveFaculty(id)
        .then((response) => {
          console.log(response.data);
          setFac(response.data);
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
            setGetFacError(error.response.data);
          } else console.log(error);
        });
    } else navigate("/faculty");
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const removeFac = (e) => {
    e.preventDefault();

    console.log("removing faculty: ", getFacError);
    console.log("removing faculty-id: ", id);

    // api call
    FacultyService.removeFaculty(fac)
      .then((response) => {
        console.log(response.data);
        var facRemoveResponse = {
          responseCode: response.data.responseCode,
          responseMessage: response.data.responseMessage,
        };
        setFacRemoveResponse(facRemoveResponse);
        // 0: success
        if (response.data.responseCode === 0) {
          setTimeout(() => {
            navigate("/faculty");
          }, 3000);
        }
        // -1: fail
        else {
        }
      })
      .catch((error) => {
        setFacRemoveResponse(error);
      });
  };

  const goBack = (e) => {
    navigate("/faculty");
  };

  const assignmentColumns = [
    {
      dataField: "assignmentId",
      text: "#",
    },
    {
      dataField: "asmtUploadId",
      text: "File Upload #",
    },
    {
      dataField: "title",
      text: "Title",
    },
  ];

  const courseColumns = [
    {
      dataField: "courseId",
      text: "#",
    },
    {
      dataField: "name",
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
                    <h3>Remove Faculty</h3>
                    {!getFacError && (
                      <h5>
                        <span className="headerText">
                          Are you sure wants to remove faculty?
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
                {facRemoveResponse && facRemoveResponse.responseCode === -1 ? (
                  <span className="facRemoveError">
                    {facRemoveResponse.responseMessage}
                  </span>
                ) : (
                  <span className="facRemoveSuccess">
                    {facRemoveResponse.responseMessage}
                  </span>
                )}
              </div>

              <div className="card-body">
                {!getFacError ? (
                  <div style={{ color: displayContentColor }}>
                    <div className="container">
                      <h6>Faculty # : {fac.facultyRemove.facultyId}</h6>
                      <h6>Faculty Name : {fac.facultyRemove.name}</h6>
                      <h6>API Code : {fac.errorCode}</h6>
                      <div>
                        <h6>
                          API Message : {fac.errorMessage}
                          <p></p>
                          {fac.errorCode < 0 ? (
                            <Button
                              className="btn btn-danger"
                              type="button"
                              onClick={(e) => removeFac(e)}
                            >
                              Force Remove Faculty
                            </Button>
                          ) : (
                            <Button
                              className="btn btn-primary"
                              type="button"
                              onClick={(e) => removeFac(e)}
                            >
                              Remove Department
                            </Button>
                          )}
                        </h6>
                      </div>
                      <hr />
                      <h5>
                        <u>Depending Assignments...</u>
                      </h5>
                      <div>
                        {fac.facultyRemove.dependingAssignments &&
                        fac.facultyRemove.dependingAssignments.length > 0 ? (
                          <BootstrapTable
                            bootstrap4
                            keyField="assignmentId"
                            data={fac.facultyRemove.dependingAssignments}
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
                        {fac.dependingCourses &&
                        fac.dependingCourses.length > 0 ? (
                          <BootstrapTable
                            bootstrap4
                            keyField="courseId"
                            data={fac.dependingCourses}
                            columns={courseColumns}
                          />
                        ) : (
                          <div className="noData">No Courses!</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="facRemoveError">{getFacError}</span>
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
