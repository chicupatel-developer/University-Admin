import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";
import CourseService from "../../services/course.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Add_Courses_To_Student = () => {
  let navigate = useNavigate();
  let { id } = useParams();

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

  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMyCourses((prev) => [...prev, value]);
    } else {
      setMyCourses((prev) => prev.filter((x) => x !== value));
    }
  };
  const updateAllCourseList = (selectedCourseList, courseList) => {
    const newState = courseList.map((obj) => {
      const found = selectedCourseList.find((selectedCrs) => {
        return selectedCrs.courseId === obj.courseId;
      });

      if (found !== undefined) {
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
                onChange={handleChange}
              />
              &nbsp;
              {dt.courseId}- {dt.courseName}
            </label>
          </div>
        );
      })
    );
  };

  const getAlreadySelectedCoursesForStudent = (e) => {
    getCoursesForStudent(id);
  };
  return (
    <div className="mainContainer">
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
        {processCourses && processCourses.length > 0 ? (
          <div>
            <div className="title">
              <p></p>
              Select Courses
            </div>
            <p></p>
            {processCourses && processCourses.length > 0 && renderList()}
          </div>
        ) : (
          <span></span>
        )}

        {myCourses && myCourses.length > 0 ? (
          <div>
            Your updated Course-List:{" "}
            {myCourses.length ? myCourses.join(", ") : null}
          </div>
        ) : (
          <span></span>
        )}

        <p></p>
        <div className="row">
          <div className="col-md-6 mx-auto">
            <Button
              className="btn btn-success"
              type="button"
              onClick={(e) => getAlreadySelectedCoursesForStudent(e)}
            >
              Connect Course(s) To Student
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add_Courses_To_Student;
