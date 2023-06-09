import React, { useState, useEffect } from "react";
import "./style.css";
import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";
import CourseService from "../../services/course.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

import Moment from "moment";

import { getGender, getGenderStyle } from "../../services/local.service";

const Student = () => {
  let navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const getAllStudents = () => {
    StudentService.allStudents()
      .then((response) => {
        setStudents(response.data);
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 401) {
          console.log("Token Not Found!");
          AuthService.logout();
          navigate("/login");
        }
      });
  };

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else getAllStudents();
  }, []);

  const displayActionBtn = (cell, row) => {
    // console.log(row);
    return (
      <div>
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) =>
            editStudentCourse(e, row.studentId, row.firstName, row.lastName)
          }
        >
          <i className="bi bi-pencil-square"></i> Course
        </Button>
      </div>
    );
  };
  const displayName = (cell, row) => {
    return (
      <span>
        {row.firstName} , {row.lastName}
      </span>
    );
  };
  const displayEmail = (cell) => {
    return (
      <span>
        {cell.length >= 20 ? (
          <span>
            {cell.substring(0, 20)}
            <span className="longEmail"> ,,,</span>
          </span>
        ) : (
          <span>{cell} </span>
        )}
      </span>
    );
  };
  const displayGender = (cell, row) => {
    return (
      <span style={{ color: getGenderStyle(cell) }}>{getGender(cell)}</span>
    );
  };

  const displayKey = (cell) => {
    return (
      <div>
        <Button
          className="btn btn-primary"
          type="button"
          onClick={(e) => studentDetails(e, cell)}
        >
          # {cell}
        </Button>
      </div>
    );
  };

  const columns = [
    {
      dataField: "studentId",
      text: "#",
      sort: true,
      formatter: (cell) => displayKey(cell),
    },
    {
      dataField: "firstName",
      text: "Name",
      sort: true,
      formatter: (cell, row) => displayName(cell, row),
    },
    {
      dataField: "email",
      text: "Email",
      formatter: (cell) => displayEmail(cell),
    },
    {
      dataField: "phoneNumber",
      text: "Phone",
      sort: true,
    },
    {
      dataField: "gender",
      text: "Gender",
      sort: true,
      formatter: (cell, row) => displayGender(cell, row),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => displayActionBtn(cell, row),
    },
  ];

  const createNewStudent = () => {
    navigate("/student-create");
  };
  const editStudentCourse = (e, stdId, firstName, lastName) => {
    console.log("edit student course : ", stdId);
    // navigate("/add-courses-to-student/" + stdId);
    navigate("/add-courses-to-student", {
      state: { id: stdId, studentName: firstName + ", " + lastName },
    });
  };
  const studentDetails = (e, stdId) => {
    console.log("getting student details : ", stdId);
    navigate("/student-details/" + stdId);
  };

  return (
    <div className="container">
      <div className="mainHeader">Students</div>
      <hr />
      <Button
        className="btn btn-success"
        type="button"
        onClick={(e) => createNewStudent(e)}
      >
        Create New Student
      </Button>
      <p></p>
      {students && students.length > 0 ? (
        <BootstrapTable
          bootstrap4
          keyField="studentId"
          data={students}
          columns={columns}
          pagination={paginationFactory({ sizePerPage: 5 })}
          filter={filterFactory()}
        />
      ) : (
        <div className="noStudents">No Student!</div>
      )}
    </div>
  );
};

export default Student;
