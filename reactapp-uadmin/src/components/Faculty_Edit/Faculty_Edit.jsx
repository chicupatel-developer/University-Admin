import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import DepartmentService from "../../services/department.service";
import FacultyService from "../../services/faculty.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Faculty_Edit = () => {
  let navigate = useNavigate();

  let { id } = useParams();
  const [genders, setGenders] = useState([]);
  const [depts, setDepts] = useState([]);

  const [modelErrors, setModelErrors] = useState([]);
  const [facEditResponse, setFacEditResponse] = useState({});

  // form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      setGenders(["Male", "Female", "Other"]);
      getAllDepartments();
      getFaculty(id);
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

  const getFaculty = (id) => {
    console.log("Editing faculty : ", id);
    if (checkForNumbersOnly(id)) {
      FacultyService.getFaculty(id)
        .then((response) => {
          if (response.data === "") {
            // data not found on server!
            var facEditResponse = {
              responseCode: -1,
              responseMessage: "Faculty Not Found!",
            };

            setFacEditResponse(facEditResponse);
          } else {
            console.log(response.data);

            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            setPhoneNumber(response.data.phoneNumber);
            setEmail(response.data.email);
            setGender(convertGenderForDisplay(response.data.gender));
            setDepartmentId(response.data.departmentId);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else navigate("/faculty");
  };

  // reset form
  // form reference
  const formRef = useRef(null);

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
    if (!errors[firstName])
      setErrors({
        ...errors,
        firstName: "",
      });
  };
  const handleLastName = (event) => {
    setLastName(event.target.value);
    if (!errors[lastName])
      setErrors({
        ...errors,
        lastName: "",
      });
  };
  const handlePhoneNumber = (event) => {
    setPhoneNumber(event.target.value);
    if (!errors[phoneNumber])
      setErrors({
        ...errors,
        phoneNumber: "",
      });
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
    if (!errors[email])
      setErrors({
        ...errors,
        email: "",
      });
  };
  const handleGender = (event) => {
    setGender(event.target.value);
    if (!errors[gender])
      setErrors({
        ...errors,
        gender: "",
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

  const checkForPhoneNumber = (newVal) => {
    // const re = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
    const re = /^(()?\d{3}())?(-|\s)?\d{3}(-|\s)?\d{4}$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const checkForEmail = (newVal) => {
    const re = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const findFormErrors = () => {
    const newErrors = {};

    if (!firstName || firstName === "")
      newErrors.firstName = "First Name is Required!";
    if (!lastName || lastName === "")
      newErrors.lastName = "Last Name is Required!";

    if (!(!phoneNumber || phoneNumber === "")) {
      if (!checkForPhoneNumber(phoneNumber))
        newErrors.phoneNumber = "Invalid Phone Number!";
    }

    if (!email || email === "") newErrors.email = "Email is Required!";
    if (!(!email || email === "")) {
      if (!checkForEmail(email)) newErrors.email = "Invalid Email!";
    }

    if (!gender || gender === "") newErrors.gender = "Gender is Required!";

    if (!departmentId || departmentId === "")
      newErrors.departmentId = "Department is Required!";
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

  const convertGender = (gender) => {
    if (gender === "Male") return 0;
    else if (gender === "Female") return 1;
    else return 2;
  };

  const convertGenderForDisplay = (genderCode) => {
    if (genderCode === 0) return "Male";
    else if (genderCode === 1) return "Female";
    else return "Other";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var facModel = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        gender: convertGender(gender),
        departmentId: Number(departmentId),
        facultyId: Number(id),
      };

      console.log(facModel);

      // api call
      FacultyService.editFaculty(facModel)
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
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setEmail("");
    setGender("");
    setDepartmentId("");
    setFacEditResponse({});
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

  const renderOptionsForGenders = () => {
    return genders.map((dt, i) => {
      return (
        <option value={dt} key={i} name={dt}>
          {dt}
        </option>
      );
    });
  };

  const renderOptionsForDepartments = () => {
    return depts.map((dt, i) => {
      return (
        <option value={dt.departmentId} key={i} name={dt.departmentName}>
          {dt.departmentName}
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
                <h3>Edit Faculty # {id}</h3>
                <p></p>{" "}
                {facEditResponse && facEditResponse.responseCode === -1 ? (
                  <span className="facEditError">
                    {facEditResponse.responseMessage}
                  </span>
                ) : (
                  <span className="facEditSuccess">
                    {facEditResponse.responseMessage}
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
                      <Form.Group controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          value={firstName}
                          type="text"
                          isInvalid={!!errors.firstName}
                          onChange={(e) => handleFirstName(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={lastName}
                          isInvalid={!!errors.lastName}
                          onChange={(e) => handleLastName(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="phoneNumber">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          type="text"
                          value={phoneNumber}
                          isInvalid={!!errors.phoneNumber}
                          onChange={(e) => handlePhoneNumber(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phoneNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-5 mx-auto">
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="text"
                          value={email}
                          isInvalid={!!errors.email}
                          onChange={(e) => handleEmail(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          as="select"
                          value={gender}
                          isInvalid={!!errors.gender}
                          onChange={(e) => handleGender(e)}
                        >
                          <option value="">Select Gender</option>
                          {renderOptionsForGenders()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.gender}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="departmentId">
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                          as="select"
                          value={departmentId}
                          isInvalid={!!errors.departmentId}
                          onChange={(e) => handleDepartmentId(e)}
                        >
                          <option value="">Select Department</option>
                          {renderOptionsForDepartments()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.departmentId}
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
export default Faculty_Edit;
