import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import DepartmentService from "../../services/department.service";
import AssignmentService from "../../services/assignment.service";
import CourseService from "../../services/course.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Course_Edit = () => {
  let navigate = useNavigate();

  let { id } = useParams();
  const [faculties, setFaculties] = useState([]);

  const [modelErrors, setModelErrors] = useState([]);
  const [courseEditResponse, setCourseEditResponse] = useState({});

  // form
  const [courseName, setCourseName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      getCourse(id);
    }
  }, []);

  const getCourse = (id) => {
    console.log("Editing course : ", id);
    if (checkForNumbersOnly(id)) {
      CourseService.getCourse(id)
        .then((response) => {
          if (response.data === "") {
            // data not found on server!
            var courseEditResponse = {
              responseCode: -1,
              responseMessage: "Course Not Found!",
            };

            setCourseEditResponse(courseEditResponse);
          } else {
            console.log(response.data);

            setCourseName(response.data.courseName);
            setFacultyId(response.data.currentFacultyId);
            setDepartmentId(response.data.departmentId);
            setFaculties(response.data.facultyList);;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else navigate("/course");
  };

  // reset form
  // form reference
  const formRef = useRef(null);

  const handleCourseName = (event) => {
    setCourseName(event.target.value);
    if (!errors[courseName])
      setErrors({
        ...errors,
        courseName: "",
      });
  };
  const handleFacultyId = (event) => {
    setFacultyId(event.target.value);
    if (!errors[facultyId])
      setErrors({
        ...errors,
        facultyId: "",
      });
  };
  const handleDepartmentId = (event) => {
    setDepartmentId(event.target.value);
    if (!errors[departmentId])
      setErrors({
        ...errors,
        departmentId: "",
      });
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const findFormErrors = () => {
    const newErrors = {};

    if (!courseName || courseName === "")
      newErrors.courseName = "Course Name is Required!";

    if (!facultyId || facultyId === "")
      newErrors.facultyId = "Faculty is Required!";
    return newErrors;
  };

  const handleModelState = (error) => {
    var errors = [];
    if (error.response.status === 400) {
      // console.log(error.response.data);

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
      var courseModel = {
        courseName: courseName,
        departmentId: Number(departmentId),
        facultyId: Number(facultyId),
        courseId: Number(id),
      };

      console.log(courseModel);
      // api call
      CourseService.editCourse(courseModel)
        .then((response) => {
          console.log(response.data);
          setModelErrors([]);
          setFacEditResponse({});
          var facEditResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };

          resetForm();
          setFacEditResponse(facEditResponse);
          if (response.data.responseCode === 0) {
            setTimeout(() => {
              navigate("/faculty");
            }, 3000);
          }
        })
        .catch((error) => {
          setModelErrors([]);
          setFacEditResponse({});
          // 400
          // ModelState
          if (error.response.status === 400) {
            console.log("400 !");
            var modelErrors = handleModelState(error);
            setModelErrors(modelErrors);
          } else {
            console.log(error);
          }
        });
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setCourseName("");
    setDepartmentId("");
    setFacultyId("");
    setCourseEditResponse({});
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

  const renderOptionsForFaculties = () => {
    return faculties.map((dt, i) => {
      return (
        <option value={dt.facultyId} key={i} name={dt.facultyName}>
          {dt.facultyName}
        </option>
      );
    });
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-header header">
                <h3>Edit Course # {id}</h3>
                <p></p>{" "}
                {courseEditResponse &&
                courseEditResponse.responseCode === -1 ? (
                  <span className="courseEditError">
                    {courseEditResponse.responseMessage}
                  </span>
                ) : (
                  <span className="courseEditSuccess">
                    {courseEditResponse.responseMessage}
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
                      <Form.Group controlId="courseName">
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control
                          value={courseName}
                          type="text"
                          isInvalid={!!errors.courseName}
                          onChange={(e) => handleCourseName(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.courseName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="facultyId">
                        <Form.Label>Faculty</Form.Label>
                        <Form.Control
                          as="select"
                          value={facultyId}
                          isInvalid={!!errors.facultyId}
                          onChange={(e) => handleFacultyId(e)}
                        >
                          <option value="">Select Faculty</option>
                          {renderOptionsForFaculties()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.facultyId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
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
                      Edit Faculty
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
      </div>
    </div>
  );
};
export default Course_Edit;
