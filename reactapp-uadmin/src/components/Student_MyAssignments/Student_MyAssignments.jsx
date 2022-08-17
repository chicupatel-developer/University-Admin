import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";
import {
  convertAsmtStatus,
  getAsmtStatusClass,
} from "../../services/local.service";
import { useNavigate, useLocation } from "react-router";

import Moment from "moment";

const Student_MyAssignments = () => {
  let navigate = useNavigate();
  // let { id } = useParams();

  const { state } = useLocation();
  const { studentId, firstName, lastName, courseId, courseName } = state; // Read values passed on state

  const [myAsmts, setMyAsmts] = useState([]);
  const [asmtLinkStatusClass, setAsmtLinkStatusClass] = useState("");

  const [asmtToDownload, setAsmtToDownload] = useState(null);
  const [downloadMsg, setDownloadMsg] = useState("");
  const [downloadClass, setDownloadClass] = useState("");

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Student"))
      navigate("/un-auth");
    else {
      console.log(studentId, firstName, lastName, courseId);
      loadAsmtsForStudentCourse();
    }
  }, []);

  const loadAsmtsForStudentCourse = () => {
    var stdCrsData = {
      studentId: studentId,
      courseId: courseId,
    };
    StudentService.loadAsmtsForStudentCourse(stdCrsData)
      .then((response) => {
        setMyAsmts(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const downloadAssignment = (e, asmt, index) => {
    setAsmtToDownload(asmt.asmtFileName);

    var stdToAsmtDownload = {
      studentId: studentId,
      assignmentId: asmt.assignmentId,
      asmtFileName: asmt.asmtFileName,
    };
    console.log(stdToAsmtDownload);

    StudentService.downloadAsmt(stdToAsmtDownload)
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
        } else {
          setDownloadMsg("Error while downloading assignment file !");
        }
        setDownloadClass("redClass");

        setTimeout(() => {
          setAsmtToDownload(null);
          setDownloadMsg("");
          setDownloadClass("");
        }, 4000);
      });
  };

  const submitAssignment = (e, asmt, index) => {
    var stdToAsmt = {
      studentId: studentId,
      assignmentId: asmt.assignmentId,
      title: asmt.title,
      courseId: courseId,
      courseName: asmt.courseName,
      firstName: firstName,
      lastName: lastName,
    };
    navigate("/submit-assignment", {
      state: stdToAsmt,
    });
  };
  const checkAsmtLinkStatus = (a) => {
    if (a.asmtLinkStatus === 2) return false;
    else return true;
  };

  const renderAllAssignments = () => {
    return myAsmts.map((dt, i) => {
      return (
        <div key={i}>
          <div className="card">
            <div className="card-header">
              <div className="row asmtInfo">
                <div className="col-md-6 mx-auto ">
                  {dt.courseName}
                  <br />
                  <span className={`${getAsmtStatusClass(dt.asmtLinkStatus)}`}>
                    {convertAsmtStatus(dt.asmtLinkStatus)}
                  </span>
                </div>
                <div className="col-md-6 mx-auto">
                  {dt.asmtFileName}
                  <br />
                  <div className="row">
                    {checkAsmtLinkStatus(dt) && (
                      <div className="col-md-6 mx-auto ">
                        <Button
                          className="btn btn-info"
                          type="button"
                          onClick={(e) => downloadAssignment(e, dt, i)}
                        >
                          Download Assignment
                        </Button>
                        <br />
                        {asmtToDownload &&
                          asmtToDownload === dt.asmtFileName && (
                            <span className={downloadClass}>{downloadMsg}</span>
                          )}
                      </div>
                    )}

                    {checkAsmtLinkStatus(dt) && (
                      <div className="col-md-6 mx-auto ">
                        <Button
                          className="btn btn-success"
                          type="button"
                          onClick={(e) => submitAssignment(e, dt, i)}
                        >
                          Submit Assignment
                        </Button>
                      </div>
                    )}
                    <p></p>
                  </div>
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
      <div className="mainHeader">My-Assignments</div>
      <p></p>
      <div className="row">
        <div className="col-md-3 mx-auto"></div>
        <div className="col-md-6 mx-auto">
          <div className="studentHeader">
            # {studentId} ) {firstName}, {lastName}
          </div>
        </div>
        <div className="col-md-3 mx-auto"></div>
      </div>
      <p></p>
      <div className="row">
        <div className="col-md-12 mx-auto">
          <div>{myAsmts && myAsmts.length > 0 && renderAllAssignments()}</div>
        </div>
      </div>
    </div>
  );
};

export default Student_MyAssignments;
