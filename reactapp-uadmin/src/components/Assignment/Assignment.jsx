import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import AuthService from "../../services/auth.service";
import AssignmentService from "../../services/assignment.service";
import DepartmentService from "../../services/department.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import Moment from "moment";

const Assignment = () => {
  let navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);

  // download assignment
  const [asmtToDownload, setAsmtToDownload] = useState(null);
  const [downloadMsg, setDownloadMsg] = useState("");
  const [downloadClass, setDownloadClass] = useState("");

  // search
  const [enableSearch, setEnableSearch] = useState(false);
  const [facs, setFacs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({});
  // reset form
  // form reference
  const formRef = useRef(null);

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      getAllAssignments();
    }
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
        setDownloadMsg(
          "Downloading..." + asmt.asmtFileName.substring(0, 35) + " !"
        );
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

  // search
  // displays faculties belong to all assignments in db
  // no api call
  // displays unique list of faculties from current list of assignments
  const displaySearchPanel = (e) => {
    loadAllDepartments();
    refreshFacs();
    setEnableSearch(true);
  };
  const refreshFacs = () => {
    setFacs([]);
    let facs_ = [];
    const map = new Map();
    for (const item of assignments) {
      if (!map.has(item.facultyId)) {
        map.set(item.facultyId, true);
        facs_.push({
          facultyId: item.facultyId,
          facultyName: item.facultyName,
        });
      }
    }
    setFacs(facs_);
    console.log(facs);
  };
  const loadAllDepartments = () => {
    DepartmentService.allDepartments()
      .then((response) => {
        console.log(response.data);
        setDepartments(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };
  const resetForm = (e) => {
    formRef.current.reset();
    setForm({});
    setEnableSearch(false);
  };
  const renderOptionsForDepartments = () => {
    return departments.map((dt, i) => {
      return (
        <option value={dt.departmentId} key={i} name={dt.departmentName}>
          {dt.departmentName}
        </option>
      );
    });
  };
  const renderOptionsForFaculties = () => {
    return facs.map((dt, i) => {
      return (
        <option value={dt.facultyId} key={i} name={dt.facultyName}>
          {dt.facultyName}
        </option>
      );
    });
  };
  const searchBy = (e) => {};

  return (
    <div className="container">
      <div className="mainHeader">Assignments</div>
      <hr />
      <div className="row">
        <div className="col-md-12 mx-auto">
          <div className="card">
            <div className="card-header header">
              <div className="row">
                <div className="col-md-4 mx-auto">
                  <Button
                    className="btn btn-success"
                    type="button"
                    onClick={(e) => createNewAssignment(e)}
                  >
                    Create New Assignment
                  </Button>
                </div>
                <div className="col-md-8 mx-auto">
                  {!enableSearch && (
                    <div>
                      <Button
                        className="btn btn-info"
                        type="button"
                        onClick={(e) => displaySearchPanel(e)}
                      >
                        S.E.A.R.C.H
                      </Button>
                      <p></p>{" "}
                    </div>
                  )}

                  {enableSearch && (
                    <Form ref={formRef}>
                      <div className="row searchPanel">
                        <div className="col-md-4 mx-auto">
                          <Form.Group controlId="departmentId">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                              as="select"
                              onChange={(e) => {
                                setField("departmentId", e.target.value);
                              }}
                            >
                              <option value="">Select Department</option>
                              {renderOptionsForDepartments()}
                            </Form.Control>
                          </Form.Group>
                        </div>
                        <div className="col-md-4 mx-auto">
                          <Form.Group controlId="facultyId">
                            <Form.Label>Faculty</Form.Label>
                            <Form.Control
                              as="select"
                              onChange={(e) => {
                                setField("facultyId", e.target.value);
                              }}
                            >
                              <option value="">Select Faculty</option>
                              {renderOptionsForFaculties()}
                            </Form.Control>
                          </Form.Group>
                        </div>
                        <div className="col-md-4 mx-auto">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button
                              className="btn btn-success"
                              type="button"
                              onClick={(e) => searchBy(e)}
                            >
                              Search
                            </Button>
                            <Button
                              className="btn btn-primary"
                              type="button"
                              onClick={(e) => resetForm(e)}
                            >
                              Reset
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </div>
              </div>
            </div>
            <div className="card-body">{renderAllAssignments()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
