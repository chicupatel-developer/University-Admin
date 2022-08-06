import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import DepartmentService from "../../services/department.service";

import { useNavigate } from "react-router";

import Moment from "moment";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const Department_Remove = () => {
  let navigate = useNavigate();

  let { id } = useParams();
  const [getDeptError, setGetDeptError] = useState("");
  const [responseColor, setResponseColor] = useState("");
  const [displayContentColor, setDisplayContentColor] = useState("");

  const [dept, setDept] = useState({});
  const [deptRemoveResponse, setDeptRemoveResponse] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else initializeRemoveDepartment(id);
  }, []);

  const initializeRemoveDepartment = (id) => {
    console.log("Initializing Department Remove Process : ", id);
    if (checkForNumbersOnly(id)) {
      setGetDeptError("");
      DepartmentService.initializeRemoveDepartment(id)
        .then((response) => {
          console.log(response.data);
          setDept(response.data);
          // if safe to remove, means no dependancy then green
          if (response.data.errorCode >= 0) {
            setResponseColor("green");
            setDisplayContentColor("green");
          }
          // else not safe to remove, means dependancy then red
          else {
            setResponseColor("red");
            setDisplayContentColor("red");
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            setGetDeptError(error.response.data);
          } else console.log(error);
        });
    } else navigate("/department");
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const removeDept = (e) => {
    e.preventDefault();

    console.log("removing department: ", dept);
    console.log("removing department-id: ", id);
  };

  const goBack = (e) => {
    navigate("/department");
  };

  const facultyColumns = [
    {
      dataField: "facultyId",
      text: "#",
    },
    {
      dataField: "name",
      text: "Faculty",
    },
    {
      dataField: "dependingAssignments",
      text: "Assignments",
      formatter: (cell) => displayAssignments(cell),
    },
  ];
  const displayAssignments = (cell) => {
    return cell.length > 0 ? (
      cell.map((item, i) => {
        return (
          <div key={i} value={item.assignmentId}>
            <span>- {item.title}</span>
            <br />
          </div>
        );
      }, this)
    ) : (
      <span>
        <b>N/A</b>
      </span>
    );
  };

  const courseColumns = [
    {
      dataField: "courseId",
      text: "#",
    },
    {
      dataField: "name",
      text: "Course",
    },
  ];

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="card">
              <div className="card-header">
                <h3>Remove Department</h3>
                {!getDeptError && (
                  <h5>
                    <span className="headerText">
                      Are you sure wants to remove department?
                    </span>
                  </h5>
                )}
                <p></p>{" "}
                {deptRemoveResponse &&
                deptRemoveResponse.responseCode === -1 ? (
                  <span className="deptRemoveError">
                    {deptRemoveResponse.responseMessage}
                  </span>
                ) : (
                  <span className="deptRemoveSuccess">
                    {deptRemoveResponse.responseMessage}
                  </span>
                )}
              </div>

              <div className="card-body">
                {!getDeptError ? (
                  <div style={{ color: displayContentColor }}>
                    <div className="container">
                      <h6>Department # : {dept.departmentId}</h6>
                      <h6>Department Name : {dept.departmentName}</h6>
                      <h6>API Code : {dept.errorCode}</h6>
                      <div>
                        <h6>
                          API Message : {dept.errorMessage}
                          <p></p>
                          {dept.errorCode < 0 ? (
                            <Button
                              className="btn btn-danger"
                              type="button"
                              onClick={(e) => removeDept(e)}
                            >
                              Force Remove Department
                            </Button>
                          ) : (
                            <Button
                              className="btn btn-primary"
                              type="button"
                              onClick={(e) => removeDept(e)}
                            >
                              Remove Department
                            </Button>
                          )}
                        </h6>
                      </div>
                      <hr />
                      <h5>
                        <u>Depending Faculties...</u>
                      </h5>
                      <div>
                        {dept.dependingFaculties &&
                        dept.dependingFaculties.length > 0 ? (
                          <BootstrapTable
                            bootstrap4
                            keyField="facultyId"
                            data={dept.dependingFaculties}
                            columns={facultyColumns}
                          />
                        ) : (
                          <div className="noData">No Faculties!</div>
                        )}
                      </div>

                      <h5>
                        <u>Depending Courses...</u>
                      </h5>
                      <div>
                        {dept.dependingCourses &&
                        dept.dependingCourses.length > 0 ? (
                          <BootstrapTable
                            bootstrap4
                            keyField="courseId"
                            data={dept.dependingCourses}
                            columns={courseColumns}
                          />
                        ) : (
                          <div className="noData">No Courses!</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="deptRemoveError">{getDeptError}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department_Remove;
