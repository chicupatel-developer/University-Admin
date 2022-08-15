import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Add_Courses_To_Student = () => {
  const checkList = ["Apple", "Banana", "Tea", "Coffee"];
  const [checked, setChecked] = useState([]);
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
    </div>
  );
};

export default Add_Courses_To_Student;
