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

  const selectedLanguageList = [
    { value: 1, label: "English", checked: true },
    { value: 2, label: "Hindi", checked: true },
  ];
  const languageList = [
    { value: 1, label: "English", checked: false },
    { value: 2, label: "Hindi", checked: false },
    { value: 3, label: "Spanish", checked: false },
    { value: 4, label: "Arabic", checked: false },
  ];
  const [lang, setLang] = useState([]);
  const [langList, setLangList] = useState([]);
  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      // push selected value in list
      setLang((prev) => [...prev, value]);
    } else {
      // remove unchecked value from the list
      setLang((prev) => prev.filter((x) => x !== value));
    }
  };
  const fcuk = (selectedLanguageList, languageList) => {
    const newState = languageList.map((obj) => {
      if (obj.value === 1) {
        return { ...obj, checked: true };
      }
      if (obj.value === 2) {
        return { ...obj, checked: true };
      }
      return obj;
    });
    setLangList(newState);
    console.log(langList);
  };
  const getLangList = () => {
    setLangList(languageList);
  };

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      // getAllCourses();

      getLangList();
      fcuk(selectedLanguageList, languageList);
    }
  }, []);

  const getAllCourses = () => {
    console.log("haha");
    CourseService.allCourses()
      .then((response) => {
        console.log("getting all courses" + response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getCoursesForStudent = (id) => {
    console.log("getting courses for student : ", id);
    if (checkForNumbersOnly(id)) {
      StudentService.loadCoursesForStudent(id)
        .then((response) => {
          console.log("loading courses for student", response.data);
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

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="title">Select languages from the list</div>
        {langList.map((x, i) => (
          <label key={i}>
            <input
              defaultChecked={x.checked}
              type="checkbox"
              name="lang"
              value={x.value}
              onChange={handleChange}
            />{" "}
            {x.label}
          </label>
        ))}

        <div>Selected languages: {lang.length ? lang.join(", ") : null}</div>
      </div>
    </div>
  );
};

export default Add_Courses_To_Student;
