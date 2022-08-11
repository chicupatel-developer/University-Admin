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
    const { departmentId, facultyId, courseId } = form;
    const newErrors = {};

    if (!departmentId || departmentId === "")
      newErrors.departmentId = "Department is Required!";

    if (!facultyId || facultyId === "")
      newErrors.facultyId = "Faculty is Required!";

    if (!courseId || courseId === "")
      newErrors.courseId = "Course is Required!";

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
        <div className="row">
          <div className="col-md-6 mx-auto">
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
                    <div className="col-md-10 mx-auto">
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
      </div>
    </div>
  );
};

export default Assignment_Create;
