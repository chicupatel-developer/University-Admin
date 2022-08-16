import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";
import CourseService from "../../services/course.service";

import { useNavigate, useLocation } from "react-router";

import Moment from "moment";

const Add_Courses_To_Student = () => {
  let navigate = useNavigate();
  // let { id } = useParams();

  const { state } = useLocation();
  const { id, studentName } = state; // Read values passed on state

  const [mapCourseToStudentResponse, setMapCourseToStudentResponse] = useState(
    {}
  );

  const [allCourses, setAllCourses] = useState([]);
  const [processCourses, setProcessCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      getAllCourses();
    }
  }, []);

  const handleChange = (e, dt) => {
    // value === courseId
    const { value, checked } = e.target;
    const { courseId, courseName } = dt;
    console.log("click on ...", courseId, "...", checked);
    if (checked) {
      setMyCourses((prev) => [
        ...prev,
        { courseId: courseId, courseName: courseName },
      ]);
    } else {
      setMyCourses((prev) => prev.filter((x) => x.courseId !== courseId));
      // setProcessCourses((prev) => prev.filter((x) => x.courseId !== value));
    }
  };
  const updateAllCourseList = (selectedCourseList, courseList) => {
    const newState = courseList.map((obj) => {
      const found = selectedCourseList.find((selectedCrs) => {
        return selectedCrs.courseId === obj.courseId;
      });

      if (found !== undefined) {
        setMyCourses((prev) => [
          ...prev,
          { courseId: obj.courseId, courseName: obj.courseName },
        ]);
        return { ...obj, checked: true };
      } else {
        return obj;
      }
    });
    setProcessCourses(newState);
  };
  const getAllCourses = () => {
    CourseService.allCourses()
      .then((response) => {
        setAllCourses(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getCoursesForStudent = (id) => {
    if (checkForNumbersOnly(id)) {
      StudentService.loadCoursesForStudent(id)
        .then((response) => {
          updateAllCourseList(response.data, allCourses);
        })
        .catch((e) => {
          console.log(e);
        });
    } else navigate("/student");
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const renderList = () => {
    return (
      processCourses &&
      processCourses.length > 0 &&
      processCourses.map((dt, i) => {
        return (
          <div key={i}>
            <label>
              <input
                className="checked-item"
                defaultChecked={dt.checked}
                type="checkbox"
                name="lang"
                value={dt.courseId}
                onChange={(e) => {
                  handleChange(e, dt);
                }}
              />
              &nbsp;
              {dt.courseId}- {dt.courseName}
            </label>
          </div>
        );
      })
    );
  };

  const renderSelectedList = () => {
    return (
      myCourses &&
      myCourses.length > 0 &&
      myCourses.map((dt, i) => {
        return (
          <div key={i}>
            {" "}
            &nbsp;
            {dt.courseId}- {dt.courseName}
          </div>
        );
      })
    );
  };

  const getAlreadySelectedCoursesForStudent = (e) => {
    getCoursesForStudent(id);
  };
  const connectCoursesToStudent = (e) => {
    e.preventDefault();
    var stdsToCourses = [];

    myCourses.map((obj) => {
      stdsToCourses.push({ courseId: obj.courseId, studentId: Number(id) });
    });

    console.log(stdsToCourses);

    if (stdsToCourses.length > 0) {
      // api call
      StudentService.editCourseToStd(stdsToCourses)
        .then((response) => {
          setMapCourseToStudentResponse({});
          console.log(response.data);

          var mapCourseToStudentResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };
          if (response.data.responseCode === 0) {
            setMapCourseToStudentResponse(mapCourseToStudentResponse);

            setTimeout(() => {
              navigate("/student");
            }, 3000);
          } else if (response.data.responseCode === -1) {
            setMapCourseToStudentResponse(mapCourseToStudentResponse);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      var mapCourseToStudentResponse = {
        responseCode: -1,
        responseMessage: "Please Select  Atleast 1 Course !",
      };
      setMapCourseToStudentResponse(mapCourseToStudentResponse);
    }
  };
  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-header header">
                <h5>
                  # {id} ) {studentName}
                </h5>
                <hr />
                <h4>Student To Courses Map</h4>
                {mapCourseToStudentResponse &&
                mapCourseToStudentResponse.responseCode === -1 ? (
                  <span className="mapError">
                    {mapCourseToStudentResponse.responseMessage}
                  </span>
                ) : (
                  <span className="mapSuccess">
                    {mapCourseToStudentResponse.responseMessage}
                  </span>
                )}
              </div>
              <div className="card-body">
                <div>
                  <h4>Courses</h4>
                  <div>
                    <label>
                      <input
                        disabled={true}
                        className="checked-item"
                        defaultChecked={true}
                        type="checkbox"
                        name="lang"
                      />
                      &nbsp; Already Assigned Course
                    </label>
                  </div>
                  <div>
                    <label>
                      <input
                        disabled={true}
                        className="checked-item"
                        defaultChecked={false}
                        type="checkbox"
                        name="lang"
                      />
                      &nbsp; Not Assigned Course
                    </label>
                  </div>
                </div>
                <hr />
                {!(processCourses && processCourses.length > 0) && (
                  <Button
                    className="btn btn-success"
                    type="button"
                    onClick={(e) => getAlreadySelectedCoursesForStudent(e)}
                  >
                    Get My Courses
                  </Button>
                )}

                <div className="list-container">
                  <div className="row">
                    <div className="col-md-6 mx-auto">
                      {processCourses && processCourses.length > 0 ? (
                        <div>
                          <div className="title">
                            <p></p>
                            Select Courses
                          </div>
                          <p></p>
                          {processCourses &&
                            processCourses.length > 0 &&
                            renderList()}
                        </div>
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <div className="col-md-6 mx-auto">
                      {myCourses && myCourses.length > 0 ? (
                        <div>
                          <div className="titleSelected">
                            <p></p>
                            Selected Courses
                          </div>
                          <p></p>
                          {myCourses &&
                            myCourses.length > 0 &&
                            renderSelectedList()}
                        </div>
                      ) : (
                        <span></span>
                      )}
                    </div>
                  </div>
                </div>
                {processCourses && processCourses.length > 0 && (
                  <div className="row">
                    <p></p>
                    <div className="col-md-6 mx-auto">
                      <Button
                        className="btn btn-success"
                        type="button"
                        onClick={(e) => connectCoursesToStudent(e)}
                      >
                        Connect Course(s) To Student
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add_Courses_To_Student;
