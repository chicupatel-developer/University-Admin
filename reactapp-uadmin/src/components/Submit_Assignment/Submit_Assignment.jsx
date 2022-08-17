import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import StudentService from "../../services/student.service";
import AuthService from "../../services/auth.service";

import { useNavigate, useLocation } from "react-router";

import Moment from "moment";
const Submit_Assignment = () => {
  let navigate = useNavigate();

  const { state } = useLocation();
  const {
    studentId,
    assignmentId,
    title,
    courseId,
    courseName,
    firstName,
    lastName,
  } = state || {}; // Read values passed on state

  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [className, setClassName] = useState("");
  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };
  const submitAsmt = () => {
    let currentFile = selectedFiles[0];
    console.log(currentFile);
    setProgress(0);
    setCurrentFile(currentFile);

    var stdToAsmt = JSON.stringify({
      studentId: studentId,
      assignmentId: assignmentId,
    });

    StudentService.submitAsmt(currentFile, stdToAsmt, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setMessage("Asmt File Upload Success!");
          setClassName("uploadSuccess");
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        // 400
        if (error.response.status === 400) {
          console.log("400 !");
          setMessage(error.response.data.message);
          setClassName("uploadError");
        }
        // 500
        else {
          setMessage(error.response.data.message);
          setClassName("uploadError");
        }
      });
    setSelectedFiles(undefined);
  };

  const goBack = () => {
    var student = {
      studentId: studentId,
      firstName: firstName,
      lastName: lastName,
      courseId: courseId,
    };
    navigate("/student-my-assignments", {
      state: student,
    });
  };

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Student"))
      navigate("/un-auth");
    else {
      console.log(studentId, assignmentId, firstName, lastName, courseId);
      if (studentId === undefined || assignmentId === undefined)
        navigate("/student-my-courses");
    }
  }, []);

  return (
    <div className="container">
      <div className="mainHeader">
        <div className="row">
          <div className="col-md-2 mx-auto">
            <Button
              className="btn btn-primary"
              type="button"
              onClick={(e) => goBack(e)}
            >
              <i className="bi bi-arrow-return-left"></i> Back
            </Button>
          </div>
          <div className="col-md-8 mx-auto">Submit-Assignment</div>
          <div className="col-md-2 mx-auto"></div>
        </div>
      </div>
      <div className="row stdInfoPanel">
        <div className="col-md-2 mx-auto"></div>
        <div className="col-md-8 mx-auto">
          <div className="studentHeader">
            # {studentId} ) {firstName}, {lastName}
          </div>
        </div>
        <div className="col-md-2 mx-auto"></div>
      </div>
      <p></p>

      <div className="row">
        <div className="col-md-6 mx-auto asmtUploadPanel">
          <div>
            Assignment # {assignmentId} / {title}
            <br />
            Course # {courseId} / {courseName}
          </div>
          <p></p>
          <hr />
          <p></p>
          <label className="btn btn-info">
            <input type="file" onChange={selectFile} />
          </label>
          <p></p>
          {currentFile && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: progress + "%" }}
              >
                {progress}%
              </div>
            </div>
          )}
          <p></p>
          <button
            className="btn btn-success"
            disabled={!selectedFiles}
            onClick={submitAsmt}
          >
            Upload Assignment File
          </button>
          {className === "uploadSuccess" ? (
            <div className="alert alert-light uploadSuccess" role="alert">
              {message}
            </div>
          ) : (
            <div>
              {className === "uploadError" ? (
                <div className="alert alert-light uploadError" role="alert">
                  <span>{message}</span>
                </div>
              ) : (
                <span></span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submit_Assignment;
