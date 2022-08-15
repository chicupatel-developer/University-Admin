import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";
import CourseService from "../../services/course.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Add_Courses_To_Student = () => {
  let navigate = useNavigate();
  let { id } = useParams();

  const checkList = ["Apple", "Banana", "Tea", "Coffee"];
  const [checked, setChecked] = useState([]);

  /*
  const [courses, setCourses] = useState([
    { courseId: 1, courseName: "lalala course---edited---1", checked: false },
    { courseId: 2, courseName: "lalala course---edited---2", checked: false },
    { courseId: 3, courseName: "lalala course---edited---3", checked: false },
    { courseId: 4, courseName: "lalala course---edited---4", checked: false },
  ]);
  */
  const [courses, setCourses] = useState([]);
  const [checked_, setChecked_] = useState([]);

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      getAllCourses();
    }
  }, []);

  const getAllCourses = () => {
    console.log("haha");
    CourseService.allCourses()
      .then((response) => {
        console.log("getting all courses" + response.data);
        // setCourses(response.data);
        setCourses(
          response.data.map((a) => {
            return { ...a };
          })
        );
        console.log("display all courses" + courses);
        getCoursesForStudent(id);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getCoursesForStudent = (id) => {
    console.log(courses);
    console.log("getting courses for student : ", id);
    if (checkForNumbersOnly(id)) {
      StudentService.loadCoursesForStudent(id)
        .then((response) => {
          console.log("loading courses for student", response.data);
          console.log("all courses", courses);

          for (var j = 0; j < courses.length; j++) {
            for (var i = 0; i < response.data.length; i++) {
              if (response.data[i].courseId === courses[j].courseId) {
                console.log("found ! ", courses[j].courseName);
                // courses[j].checked = true;
              }
            }
          }

          const newState = courses.map((obj) => {
            for (var i = 0; i < response.data.length; i++) {
              if (response.data[i].courseId === obj.courseId) {
                console.log("found !", obj.courseName);
                return { ...obj, checked: response.data[i].checked };
                // courses[j].checked = true;
              }
              return obj;
            }
          });
          console.log("new state : " + newState[0].courseName + ', ' + newState[0].checked);
          console.log("new state : " + newState[1].courseName + ', ' + newState[1].checked);
          console.log(
            "new state : " + newState[2].courseName + ", " + newState[2].checked
          );
          // setCourses(newState);
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

  // Add/Remove checked item from list
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };
  // Return classes based on whether item is checked
  const isChecked = (item) =>
    checked.includes(item) ? "checked-item" : "not-checked-item";
  // Generate string of checked items
  const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";
  const getSelectedItems = () => {
    console.log(checked);
  };

  /////////////////////////
  const handleCheck_ = (event) => {
    var updatedList = [...checked_];

    if (event.target.checked) {
      updatedList = [...checked_, event.target.value];
    } else {
      updatedList.splice(checked_.indexOf(event.target.value), 1);
    }
    setChecked_(updatedList);
  };
  const isChecked_ = (item) =>
    checked_.includes(item) ? "checked-item" : "not-checked-item";
  // Generate string of checked items
  const checkedItems_ = checked_.length
    ? checked_.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";
  const getSelectedItems_ = () => {
    console.log(checked_);
    var stdsToCourses = [];
    checked_.map((obj) => {
      stdsToCourses.push({
        courseId: obj,
        studentId: id,
      });
    });
    console.log(stdsToCourses);
  };

  return (
    <div className="mainContainer">
      <div className="list-container">
        {checkList.map((item, index) => (
          <div key={index}>
            <input value={item} type="checkbox" onChange={handleCheck} />
            <span className={isChecked(item)}>{item}</span>
          </div>
        ))}
        <p></p>
        <div>{`Items checked are: ${checkedItems}`}</div>
        <p></p>
        {getSelectedItems()}
      </div>

      <p></p>
      <hr />
      <p></p>
      <div className="list-container">
        {courses &&
          courses.length > 0 &&
          courses.map((item, index) => (
            <div key={index}>
              <input
                checked={item.checked}
                value={item.courseId}
                type="checkbox"
                onChange={handleCheck_}
              />
              <span className={isChecked_(item)}>{item.courseName}</span>
            </div>
          ))}
        <p></p>
        <div>{`Items checked are: ${checkedItems_}`}</div>
        <p></p>
        {getSelectedItems_()}
      </div>
    </div>
  );
};

export default Add_Courses_To_Student;
