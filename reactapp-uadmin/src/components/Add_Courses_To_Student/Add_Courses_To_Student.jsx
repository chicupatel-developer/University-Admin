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
  const [stdCourses, setStdCourses] = useState([]);
  const [processCourses, setProcessCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      getAllCourses();
      // getCoursesForStudent(id);
    }
  }, []);

  const handleChange_ = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMyCourses((prev) => [...prev, value]);
    } else {
      setMyCourses((prev) => prev.filter((x) => x !== value));
    }
  };
  const updateAllCourseList = (selectedCourseList, courseList) => {
    const newState = courseList.map((obj) => {
      selectedCourseList.map((selectedCrs) => {
        if (obj.courseId === selectedCrs.courseId) {
          console.log("found : ", selectedCrs.courseId);
          return { ...obj, checked: true };
        }
        // return obj;
      });
      /*
      if (obj.courseId === 3) {
        return { ...obj, checked: true };
      }
      if (obj.courseId === 4) {
        return { ...obj, checked: true };
      }
      */
      return obj;
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
  const isChecked = (item) =>
    stdCourses.includes(item) ? "checked-item" : "not-checked-item";

  const renderList = () => {
    return (
      processCourses &&
      processCourses?.length > 0 &&
      processCourses.map((dt, i) => {
        return (
          <label key={i}>
            <input
              className={isChecked(dt)}
              defaultChecked={dt.checked}
              type="checkbox"
              name="lang"
              value={dt.courseId}
              onChange={handleChange_}
            />{" "}
            {dt.courseName}
          </label>
        );
      })
    );
  };

  const getAlreadySelectedCoursesForStudent = (e) => {
    getCoursesForStudent(id);
  };
  return (
    <div className="mainContainer">
      <Button
        className="btn btn-success"
        type="button"
        onClick={(e) => getAlreadySelectedCoursesForStudent(e)}
      >
        Get My Courses
      </Button>
      <p></p>
      <hr />
      <p></p>
      <div className="list-container">
        <div className="title">Select courses from the list</div>

        {processCourses && processCourses.length > 0 && renderList()}

        <div>
          Selected courses: {myCourses.length ? myCourses.join(", ") : null}
        </div>
      </div>
      <hr />
      <p></p>
    </div>
  );
};

export default Add_Courses_To_Student;
