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

const Course_Create = () => {
  let navigate = useNavigate();

  const [faculties, setFaculties] = useState([]);
  const [selectedFacId, setSelectedFacId] = useState("");
  const [depts, setDepts] = useState([]);

  const [modelErrors, setModelErrors] = useState([]);

  const [courseCreateResponse, setCourseCreateResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

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
        setDepts(response.data);
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

  const listOfFaculties = (deptId) => {
    AssignmentService.listOfFaculties(deptId)
      .then((response) => {
        console.log(response.data);
        setFaculties([]);
        setSelectedFacId("");
        setFaculties(response.data);
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

  // reset form
  // form reference
  const formRef = useRef(null);

  const setField = (field, value) => {
    // departmentId
    if (field === "departmentId") {
      if (value !== "") {
        console.log(selectedFacId);
        console.log("getting faculties for department#", value);
        listOfFaculties(value);
      }
    }

    // facultyId
    if (field === "facultyId") {
      setSelectedFacId(value);
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
    const { courseName, departmentId, facultyId } = form;
    const newErrors = {};

    if (!courseName || courseName === "")
      newErrors.courseName = "Course Name is Required!";

    if (!facultyId || facultyId === "")
      newErrors.facultyId = "Faculty is Required!";

    if (!departmentId || departmentId === "")
      newErrors.departmentId = "Department is Required!";

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
      var courseModel = {
        courseName: form.courseName,
        departmentId: Number(form.departmentId),
        facultyId: Number(form.facultyId),
      };

      console.log(courseModel);

      // api call
      CourseService.createCourse(courseModel)
        .then((response) => {
          setModelErrors([]);
          setCourseCreateResponse({});
          console.log(response.data);

          var courseCreateResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };
          if (response.data.responseCode === 0) {
            resetForm();
            setCourseCreateResponse(courseCreateResponse);

            setTimeout(() => {
              navigate("/course");
            }, 3000);
          } else if (response.data.responseCode === -1) {
            setCourseCreateResponse(courseCreateResponse);
          }
        })
        .catch((error) => {
          console.log(error);
          setModelErrors([]);
          setCourseCreateResponse({});
          // 400
          // ModelState
          if (error.response.status === 400) {
            console.log("400 !");
            var modelErrors = handleModelState(error);
            setModelErrors(modelErrors);
          }
        });
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setCourseCreateResponse({});
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
    return depts.map((dt, i) => {
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

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-header">
                <h3>Create New Course</h3>
                <p></p>{" "}
                {courseCreateResponse &&
                courseCreateResponse.responseCode === -1 ? (
                  <span className="courseCreateError">
                    {courseCreateResponse.responseMessage}
                  </span>
                ) : (
                  <span className="courseCreateSuccess">
                    {courseCreateResponse.responseMessage}
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
                    <div className="col-md-10 mx-auto">
                      <Form.Group controlId="courseName">
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control
                          type="text"
                          isInvalid={!!errors.courseName}
                          onChange={(e) =>
                            setField("courseName", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.courseName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
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
                          value={selectedFacId}
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
                      Create Course
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
export default Course_Create;
