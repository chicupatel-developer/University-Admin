import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import StudentService from "../../services/student.service";

import { useNavigate } from "react-router";

import Moment from "moment";
const Submit_Assignment = (studentId, assignmentId) => {
  let navigate = useNavigate();

  const [asmtUploadId, setAsmtUploadId] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [className, setClassName] = useState("");
  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };
  const upload = () => {
    let currentFile = selectedFiles[0];
    console.log(currentFile);
    setProgress(0);
    setCurrentFile(currentFile);

    var stdToAsmt = {
      studentId: studentId,
      assignmentId: assignmentId,
    };

    StudentService.submitAsmt(currentFile, stdToAsmt, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setMessage("Asmt File Upload Success!");
          setClassName("uploadSuccess");
          setAsmtUploadId(response.data.model.asmtUploadId);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        // 400
        if (error.response.status === 400) {
          console.log("400 !");
          setMessage("400 !");
          setClassName("uploadError");
        }
        // 500
        else {
          setMessage(error.response.data.message);
          setClassName("uploadError");
        }
        setAsmtUploadId(0);
      });
    setSelectedFiles(undefined);
  };

  useEffect(() => {}, []);

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
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
              onClick={upload}
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
    </div>
  );
};

export default Submit_Assignment;
