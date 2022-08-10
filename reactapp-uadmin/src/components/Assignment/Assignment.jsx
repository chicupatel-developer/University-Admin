import React, { useState, useEffect } from "react";
import "./style.css";
import AuthService from "../../services/auth.service";
import AssignmentService from "../../services/assignment.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

import Moment from "moment";

const Assignment = () => {
  let navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);

  // download assignment
  const [asmtToDownload, setAsmtToDownload] = useState(null);

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else getAllAssignments();
  }, []);

  const getAllAssignments = () => {
    AssignmentService.allAsmtFacDept()
      .then((response) => {
        console.log(response.data);
        setAssignments(response.data);
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

  const createNewAssignment = (e) => {
    console.log("create new assignment!");
  };
  const downloadAssignment = (e, asmt, index) => {
    console.log("download assignment # ", asmt.assignmentId, asmt.asmtUploadId);
    setAsmtToDownload(asmt.asmtFileName);
  };

  const renderAllAssignments = () => {
    return assignments.map((dt, i) => {
      return (
        <div key={i}>
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-md-6 mx-auto asmtInfo">
                  {dt.departmentName} / {dt.courseName}
                  <br />
                  Faculty : {dt.facultyName}
                </div>
                <div className="col-md-6 mx-auto">
                  {dt.asmtFileName}
                  <br />
                  <Button
                    className="btn btn-info"
                    type="button"
                    onClick={(e) => downloadAssignment(e, dt, i)}
                  >
                    <a
                      href={
                        "https://localhost:44354/api/Assignment/download?fileName=" +
                        dt.asmtFileName
                      }
                    >
                      Download Assignment
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="card-body">
              Assignment : {dt.assignmentId} # {dt.title}
              <br />
              Details : {dt.details}
              <br />
              Submission Date : {Moment(dt.asmtLastDate).format("DD-MMM YYYY")}
            </div>
          </div>
          <hr />
        </div>
      );
    });
  };

  return (
    <div className="container">
      <div className="mainHeader">Assignments</div>
      <hr />
      <Button
        className="btn btn-success"
        type="button"
        onClick={(e) => createNewAssignment(e)}
      >
        Create New Assignment
      </Button>
      <p></p>
      <div className="row">
        <div className="col-md-12 mx-auto">
          <div className="card">
            <div className="card-header header">search assignments</div>
            <div className="card-body">{renderAllAssignments()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
