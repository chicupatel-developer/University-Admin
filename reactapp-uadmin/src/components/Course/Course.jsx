import React, { useState, useEffect } from "react";
import "./style.css";
import AuthService from "../../services/auth.service";
import CourseService from "../../services/course.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

import Moment from "moment";

const Course = () => {
  let navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const getAllCourses = () => {
    CourseService.allCourses()
      .then((response) => {
        setCourses(response.data);
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
    else getAllCourses();
  }, []);

  const displayActionBtn = (cell, row) => {
    // console.log(row);
    return (
      <div>
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => editCourse(e, row.courseId)}
        >
          <i className="bi bi-pencil-square"></i>
        </Button>
        &nbsp;
        <Button
          className="btn btn-danger"
          type="button"
          onClick={(e) => removeCourse(e, row.courseId)}
        >
          <i className="bi bi-trash"></i>
        </Button>
      </div>
    );
  };

  const columns = [
    {
      dataField: "courseId",
      text: "#",
      sort: true,
    },
    {
      dataField: "courseName",
      text: "Course",
      sort: true,
    },
    {
      dataField: "facultyName",
      text: "Faculty",
      sort: true,
    },
    {
      dataField: "departmentName",
      text: "Department",
      sort: true,
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => displayActionBtn(cell, row),
    },
  ];

  const createNewCourse = () => {
    navigate("/course-create");
  };
  const editCourse = (e, courseId) => {
    console.log("edit course : ", courseId);
    navigate("/course-edit/" + courseId);
  };
  const removeCourse = (e, courseId) => {
    console.log("remove course : ", courseId);
    navigate("/course-remove/" + courseId);
  };

  return (
    <div className="container">
      <div className="mainHeader">Courses</div>
      <hr />
      <Button
        className="btn btn-success"
        type="button"
        onClick={(e) => createNewCourse(e)}
      >
        Create New Course
      </Button>
      <p></p>
      {courses && courses.length > 0 ? (
        <BootstrapTable
          bootstrap4
          keyField="courseId"
          data={courses}
          columns={columns}
          pagination={paginationFactory({ sizePerPage: 5 })}
          filter={filterFactory()}
        />
      ) : (
        <div className="noFacs">No Course!</div>
      )}
    </div>
  );
};

export default Course;
