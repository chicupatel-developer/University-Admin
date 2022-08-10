import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import CourseService from "../../services/course.service";

import { useNavigate } from "react-router";

import Moment from "moment";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const Course_Remove = () => {
  let navigate = useNavigate();

  let { id } = useParams();
  const [getCourseError, setGetCourseError] = useState("");
  const [displayContentColor, setDisplayContentColor] = useState("");

  const [course, setCourse] = useState({ courseRemove: {} });
  const [courseRemoveResponse, setCourseRemoveResponse] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else initializeRemoveCourse(id);
  }, []);

  const initializeRemoveCourse = (id) => {
    console.log("Initializing Course Remove Process : ", id);
    if (checkForNumbersOnly(id)) {
      setGetCourseError("");
      CourseService.initializeRemoveCourse(id)
        .then((response) => {
          console.log(response.data);
          setCourse(response.data);
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
            setGetCourseError(error.response.data);
          } else console.log(error);
        });
    } else navigate("/course");
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const removeCourse = (e) => {
    e.preventDefault();

    console.log("removing course: ", course);
    console.log("removing course-id: ", id);

    // api call
    CourseService.removeCourse(course)
      .then((response) => {
        console.log(response.data);
        var courseRemoveResponse = {
          responseCode: response.data.responseCode,
          responseMessage: response.data.responseMessage,
        };
        setCourseRemoveResponse(courseRemoveResponse);
        // 0: success
        if (response.data.responseCode === 0) {
          setTimeout(() => {
            navigate("/course");
          }, 3000);
        }
        // -1: fail
        else {
        }
      })
      .catch((error) => {
        setCourseRemoveResponse(error);
      });
  };

  const goBack = (e) => {
    navigate("/course");
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

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="col-md-10 mx-auto">
                    <h3>Remove Course</h3>
                    {!getCourseError && (
                      <h5>
                        <span className="headerText">
                          Are you sure wants to remove course?
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
                {courseRemoveResponse &&
                courseRemoveResponse.responseCode === -1 ? (
                  <span className="courseRemoveError">
                    {courseRemoveResponse.responseMessage}
                  </span>
                ) : (
                  <span className="courseRemoveSuccess">
                    {courseRemoveResponse.responseMessage}
                  </span>
                )}
              </div>

              <div className="card-body">
                {!getCourseError ? (
                  <div style={{ color: displayContentColor }}>
                    <div className="container">
                      <h6>Course # : {course.courseRemove.courseId}</h6>
                      <h6>Course Name : {course.courseRemove.name}</h6>
                      <h6>API Code : {course.errorCode}</h6>
                      <div>
                        <h6>
                          API Message : {course.errorMessage}
                          <p></p>
                          {course.errorCode < 0 ? (
                            <Button
                              className="btn btn-danger"
                              type="button"
                              onClick={(e) => removeCourse(e)}
                            >
                              Force Remove Course
                            </Button>
                          ) : (
                            <Button
                              className="btn btn-primary"
                              type="button"
                              onClick={(e) => removeCourse(e)}
                            >
                              Remove Course
                            </Button>
                          )}
                        </h6>
                      </div>
                      <hr />
                      <h5>
                        <u>Depending Assignments...</u>
                      </h5>
                      <div>
                        {course.dependingAssignments &&
                        course.dependingAssignments.length > 0 ? (
                          <BootstrapTable
                            bootstrap4
                            keyField="assignmentId"
                            data={course.dependingAssignments}
                            columns={assignmentColumns}
                          />
                        ) : (
                          <div className="noData">No Assignments!</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="courseRemoveError">{getCourseError}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course_Remove;
