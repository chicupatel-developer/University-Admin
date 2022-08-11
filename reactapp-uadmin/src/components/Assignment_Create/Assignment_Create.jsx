import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import AssignmentService from "../../services/assignment.service";
import DepartmentService from "../../services/department.service";
import CourseService from "../../services/course.service";

import { useNavigate } from "react-router";

import Moment from "moment";
const Assignment_Create = () => {
  let navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [modelErrors, setModelErrors] = useState([]);
  const [asmtCreateResponse, setAsmtCreateResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // file upload
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
    AssignmentService.upload(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setMessage("Asmt File Upload Success!");
          setClassName("uploadSuccess");
          setSelectedFiles(undefined);
          setCurrentFile(undefined);
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
        setSelectedFiles(undefined);
        setCurrentFile(undefined);
        setAsmtUploadId(0);
      });
  };

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      getAllDepartments();
    }
  }, []);

  const getAllDepartments = () => {
    DepartmentService.allDepartments()
      .then((response) => {
        console.log(response.data);
        setDepartments(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const listOfFaculties = (deptId) => {
    AssignmentService.listOfFaculties(deptId)
      .then((response) => {
        setFaculties([]);
        console.log(response.data);
        setFaculties(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const listOfCourses = (facId) => {
    AssignmentService.listOfCourses(facId)
      .then((response) => {
        setCourses(response.data);
        console.log(response.data);
        setCourses(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // reset form
  // form reference
  const formRef = useRef(null);

  const setField = (field, value) => {
    const { departmentId, facultyId, courseId } = form;

    // departmentId
    if (field === "departmentId") {
      setFaculties([]);
      setCourses([]);
      form.facultyId = "";
      form.courseId = "";
      if (value !== "") {
        console.log("getting faculties for department#", value);
        listOfFaculties(value);
      }
    }

    // facultyId
    if (field === "facultyId") {
      setCourses([]);
      form.courseId = "";
      if (value !== "") {
        console.log("getting courses for faculty#", value);
        listOfCourses(value);
      }
    }

    setForm({
      ...form,
      [field]: value,
    });

    // Check and see if errors exist, and remove them from the error object:
    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const findFormErrors = () => {
    const { departmentId, facultyId, courseId, title, details, asmtLastDate } =
      form;
    const newErrors = {};

    if (!departmentId || departmentId === "")
      newErrors.departmentId = "Department is Required!";

    if (!facultyId || facultyId === "")
      newErrors.facultyId = "Faculty is Required!";

    if (!courseId || courseId === "")
      newErrors.courseId = "Course is Required!";

    if (!title || title === "") newErrors.title = "Title is Required!";

    if (!details || details === "") newErrors.details = "Details is Required!";

    if (!asmtLastDate || asmtLastDate === "")
      newErrors.asmtLastDate = "Last Submission Date is Required!";

    return newErrors;
  };

  const handleModelState = (error) => {
    var errors = [];
    if (error.response.status === 400) {
      for (let prop in error.response.data.errors) {
        if (error.response.data.errors[prop].length > 1) {
          for (let error_ in error.response.data.errors[prop]) {
            errors.push(error.response.data.errors[prop][error_]);
          }
        } else {
          errors.push(error.response.data.errors[prop]);
        }
      }
    } else {
      console.log(error);
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var asmtModel = {
        courseId: Number(form.courseId),
        departmentId: Number(form.departmentId),
        facultyId: Number(form.facultyId),
        title: form.title,
        details: form.details,
        asmtLastDate: form.asmtLastDate,
      };

      console.log(asmtModel);
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setAsmtCreateResponse({});
    setModelErrors([]);
  };

  let modelErrorList =
    modelErrors.length > 0 &&
    modelErrors.map((item, i) => {
      return (
        <ul key={i} value={item}>
          <li style={{ marginTop: -20 }}>{item}</li>
        </ul>
      );
    }, this);

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
    return faculties.map((dt, i) => {
      return (
        <option value={dt.facultyId} key={i} name={dt.facultyName}>
          {dt.facultyName}
        </option>
      );
    });
  };

  const renderOptionsForCourses = () => {
    return courses.map((dt, i) => {
      return (
        <option value={dt.courseId} key={i} name={dt.courseName}>
          {dt.courseName}
        </option>
      );
    });
  };
  return (
    <div className="mainContainer">
      <div className="container">
        <p></p>
        <div>
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
            <div className="alert alert-light uploadError" role="alert">
              <span>{message}</span>
            </div>
          )}
        </div>
        <p></p>
        {asmtUploadId > 0 && (
          <div className="row">
            <div className="col-md-10 mx-auto">
              <div className="card">
                <div className="card-header">
                  <h3>Create New Assignment</h3>
                  <p></p>{" "}
                  {asmtCreateResponse &&
                  asmtCreateResponse.responseCode === -1 ? (
                    <span className="asmtCreateError">
                      {asmtCreateResponse.responseMessage}
                    </span>
                  ) : (
                    <span className="asmtCreateSuccess">
                      {asmtCreateResponse.responseMessage}
                    </span>
                  )}
                  {modelErrors.length > 0 ? (
                    <div className="modelError">{modelErrorList}</div>
                  ) : (
                    <span></span>
                  )}
                </div>
                <div className="card-body">
                  <Form ref={formRef}>
                    <div className="row">
                      <div className="col-md-5 mx-auto">
                        <Form.Group controlId="departmentId">
                          <Form.Label>Department</Form.Label>
                          <Form.Control
                            as="select"
                            isInvalid={!!errors.departmentId}
                            onChange={(e) => {
                              setField("departmentId", e.target.value);
                            }}
                          >
                            <option value="">Select Department</option>
                            {renderOptionsForDepartments()}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.departmentId}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <p></p>
                        <Form.Group controlId="facultyId">
                          <Form.Label>Faculty</Form.Label>
                          <Form.Control
                            as="select"
                            isInvalid={!!errors.facultyId}
                            onChange={(e) => {
                              setField("facultyId", e.target.value);
                            }}
                          >
                            <option value="">Select Faculty</option>
                            {renderOptionsForFaculties()}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.facultyId}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <p></p>
                        <Form.Group controlId="courseId">
                          <Form.Label>Course</Form.Label>
                          <Form.Control
                            as="select"
                            isInvalid={!!errors.courseId}
                            onChange={(e) => {
                              setField("courseId", e.target.value);
                            }}
                          >
                            <option value="">Select Course</option>
                            {renderOptionsForCourses()}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.courseId}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-5 mx-auto">
                        <Form.Group controlId="title">
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            type="text"
                            isInvalid={!!errors.title}
                            onChange={(e) => setField("title", e.target.value)}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <p></p>
                        <Form.Group controlId="details">
                          <Form.Label>Details</Form.Label>
                          <Form.Control
                            type="text"
                            isInvalid={!!errors.details}
                            onChange={(e) =>
                              setField("details", e.target.value)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.details}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <p></p>
                        <Form.Group controlId="asmtLastDate">
                          <Form.Label>Last Submission Date</Form.Label>
                          <Form.Control
                            type="date"
                            name="asmtLastDate"
                            placeholder="Last Submission Date"
                            isInvalid={!!errors.asmtLastDate}
                            onChange={(e) =>
                              setField("asmtLastDate", e.target.value)
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.asmtLastDate}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>

                    <p></p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        className="btn btn-success"
                        type="button"
                        onClick={(e) => handleSubmit(e)}
                      >
                        Create Assignment
                      </Button>
                      <Button
                        className="btn btn-primary"
                        type="button"
                        onClick={(e) => resetForm(e)}
                      >
                        Reset
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignment_Create;
