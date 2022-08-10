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
  const [downloadMsg, setDownloadMsg] = useState("");
  const [downloadClass, setDownloadClass] = useState("");

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

    AssignmentService.asmtDownload(asmt.asmtFileName)
      .then((blob) => {
        console.log(blob);
        setDownloadMsg("Downloading..." + asmt.asmtFileName + " !");
        setDownloadClass("greenClass");

        // const myFile = new Blob([blob.data], { type: 'text/csv' });
        const myFile = new Blob([blob.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(myFile);
        window.open(url);

        setTimeout(() => {
          setAsmtToDownload(null);
          setDownloadMsg("");
          setDownloadClass("");
        }, 4000);
      })
      .catch((e) => {
        console.log(e);
        if (e.response.status === 500) {
          setDownloadMsg("Server Error !");
        } else if (e.response.status === 400) {
          setDownloadMsg("File Not Found !");
        }
        setDownloadClass("redClass");

        setTimeout(() => {
          setAsmtToDownload(null);
          setDownloadMsg("");
          setDownloadClass("");
        }, 4000);
      });
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
                    Download Assignment
                    {/* 
                    <a
                      href={
                        "https://localhost:44354/api/Assignment/download?fileName=" +
                        dt.asmtFileName
                      }
                    >
                      Download Assignment
                    </a>
                    */}
                  </Button>
                  <br />
                  {asmtToDownload && asmtToDownload === dt.asmtFileName && (
                    <span className={downloadClass}>{downloadMsg}</span>
                  )}
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
