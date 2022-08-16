import React, { useState, useEffect } from "react";
import "./style.css";
import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

import Moment from "moment";

const Student_MyCourses = () => {
  let navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({});
  const [myCourses, setMyCourses] = useState([]);

  const getStudentCourses = (stdId) => {
    StudentService.getMyCourses(stdId)
      .then((response) => {
        console.log(response.data);
        setMyCourses(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();
    var currUser = AuthService.getCurrentUser();

    if (currRole === null || (currRole !== null && currRole !== "Student"))
      navigate("/un-auth");
    else {
      if (currUser === null) {
        navigate("/un-auth");
      } else {
        var currentUser = {
          firstName: currUser.firstName,
          lastName: currUser.lastName,
          studentId: currUser.studentId,
        };
        setCurrentUser(currentUser);

        getStudentCourses(Number(currentUser.studentId));
      }
    }
  }, []);

  const displayActionBtn = (cell, row) => {
    // console.log(row);
    return (
      <div>
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => myAssignments(e, row.courseId)}
        >
          <i className="bi bi-pencil-square"></i>
          My Assignments
        </Button>
      </div>
    );
  };

  const columns = [
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
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => displayActionBtn(cell, row),
    },
  ];

  const myAssignments = (e, courseId) => {
    console.log("getting my-assignments for course # : ", courseId);
    var student = {
      studentId: currentUser.studentId,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      courseId: courseId,
    };
    navigate("/student-my-assignments", {
      state: student,
    });
  };

  return (
    <div className="container">
      <div className="mainHeader">My-Courses</div>
      <p></p>
      <div className="row">
        <div className="col-md-3 mx-auto"></div>
        <div className="col-md-6 mx-auto">
          <div className="studentHeader">
            # {currentUser.studentId} ) {currentUser.firstName},{" "}
            {currentUser.lastName}
          </div>
        </div>
        <div className="col-md-3 mx-auto"></div>
      </div>
      <p></p>
      {myCourses.myCourses && myCourses.myCourses.length > 0 ? (
        <BootstrapTable
          bootstrap4
          keyField="courseId"
          data={myCourses.myCourses}
          columns={columns}
          pagination={paginationFactory({ sizePerPage: 5 })}
          filter={filterFactory()}
        />
      ) : (
        <div className="noFacs">No Data!</div>
      )}
    </div>
  );
};

export default Student_MyCourses;
