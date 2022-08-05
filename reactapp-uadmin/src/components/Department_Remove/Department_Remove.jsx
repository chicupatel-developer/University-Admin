import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import DepartmentService from "../../services/department.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Department_Remove = () => {
  let navigate = useNavigate();

  let { id } = useParams();
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
      DepartmentService.initializeRemoveDepartment(id)
        .then((response) => {
          if (response.data !== "") {
            console.log(response.data);
            setDept(response.data);
          } else {
            setDept({ departmentId: 0 });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else navigate("/department");
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("removing department: ", dept);
    console.log("removing department-id: ", id);
  
  };

  const goBack = (e) => {
    navigate("/department");
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-10 mx-auto">
            <div className="card">
              <div className="card-header">
                <h3>Remove Department</h3>
                <h5>
                  <span className="headerText">
                    Are you sure wants to remove department?
                  </span>
                </h5>
                <p></p>{" "}
                {deptRemoveResponse && deptRemoveResponse.responseCode === -1 ? (
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
                <div className="container">
                  <span className="headerText">Department </span>
                  {id ? <span>&nbsp;# {id}</span> : <span>&nbsp; # N/A</span>}
                  <p></p>

                                  
                </div>

                <p></p>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    className="btn btn-success"
                    type="button"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Remove Department
                  </Button>
                  <Button
                    className="btn btn-primary"
                    type="button"
                    onClick={(e) => goBack(e)}
                  >
                    <i className="bi bi-arrow-return-left"></i> Back
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department_Remove;
