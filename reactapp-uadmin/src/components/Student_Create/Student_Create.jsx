import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Student_Create = () => {
  let navigate = useNavigate();

  const [genders, setGenders] = useState([]);

  const [modelErrors, setModelErrors] = useState([]);

  const [studentCreateResponse, setStudentCreateResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      setGenders(["Male", "Female", "Other"]);
    }
  }, []);

  // reset form
  // form reference
  const formRef = useRef(null);

  const setField = (field, value) => {
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

  const checkPostalCode = (newVal) => {
    const re =
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
    if (re.test(newVal)) return true;
    else return false;
  };

  const findFormErrors = () => {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      gender,
      homeAddress,
      homePostalCode,
      sameAddress,
      mailAddress,
      mailPostalCode,
    } = form;
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

    if (!(!homePostalCode || homePostalCode === "")) {
      if (!checkPostalCode(homePostalCode))
        newErrors.homePostalCode = "Invalid Home Postal Code!";
    }

    if (!sameAddress) {
      if (!(!mailPostalCode || mailPostalCode === "")) {
        if (!checkPostalCode(mailPostalCode))
          newErrors.mailPostalCode = "Invalid Mail Postal Code!";
      }
    }

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

  const convertGender = (gender) => {
    if (gender === "Male") return 0;
    else if (gender === "Female") return 1;
    else return 2;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var stdModel = {};
      if (form.sameAddress) {
        stdModel = {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          email: form.email,
          gender: convertGender(form.gender),
          homeAddress: form.homeAddress,
          homePostalCode: form.homePostalCode,
          mailAddress: form.homeAddress,
          mailPostalCode: form.homePostalCode,
        };
      } else {
        stdModel = {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          email: form.email,
          gender: convertGender(form.gender),
          homeAddress: form.homeAddress,
          homePostalCode: form.homePostalCode,
          mailAddress: form.mailAddress,
          mailPostalCode: form.mailPostalCode,
        };
      }

      console.log(stdModel);
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setStudentCreateResponse({});
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

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-9 mx-auto">
            <div className="card">
              <div className="card-header">
                <h3>Create New Student</h3>
                <p></p>{" "}
                {studentCreateResponse &&
                studentCreateResponse.responseCode === -1 ? (
                  <span className="studentCreateError">
                    {studentCreateResponse.responseMessage}
                  </span>
                ) : (
                  <span className="studentCreateSuccess">
                    {studentCreateResponse.responseMessage}
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
                          type="text"
                          isInvalid={!!errors.firstName}
                          onChange={(e) =>
                            setField("firstName", e.target.value)
                          }
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
                          isInvalid={!!errors.lastName}
                          onChange={(e) => setField("lastName", e.target.value)}
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
                          isInvalid={!!errors.phoneNumber}
                          onChange={(e) =>
                            setField("phoneNumber", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phoneNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="text"
                          isInvalid={!!errors.email}
                          onChange={(e) => setField("email", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-md-5 mx-auto">
                      <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.gender}
                          onChange={(e) => {
                            setField("gender", e.target.value);
                          }}
                        >
                          <option value="">Select Gender</option>
                          {renderOptionsForGenders()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.gender}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="homeAddress">
                        <Form.Label>Home Address</Form.Label>
                        <Form.Control
                          type="text"
                          onChange={(e) =>
                            setField("homeAddress", e.target.value)
                          }
                        />
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="homePostalCode">
                        <Form.Label>Home Postal</Form.Label>
                        <Form.Control
                          type="text"
                          isInvalid={!!errors.homePostalCode}
                          onChange={(e) =>
                            setField("homePostalCode", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.homePostalCode}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="sameAddress">
                        <Form.Check
                          type="checkbox"
                          onChange={(e) =>
                            setField("sameAddress", e.target.checked)
                          }
                          label={`Same Home-Address and Mail-Address!`}
                        />
                      </Form.Group>
                      <p></p>
                      {!form.sameAddress && (
                        <div>
                          <Form.Group controlId="mailAddress">
                            <Form.Label>Mail Address</Form.Label>
                            <Form.Control
                              type="text"
                              onChange={(e) =>
                                setField("mailAddress", e.target.value)
                              }
                            />
                          </Form.Group>
                          <p></p>
                          <Form.Group controlId="mailPostalCode">
                            <Form.Label>Mail Postal</Form.Label>
                            <Form.Control
                              type="text"
                              isInvalid={!!errors.mailPostalCode}
                              onChange={(e) =>
                                setField("mailPostalCode", e.target.value)
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.mailPostalCode}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </div>
                      )}
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
                      Create Student
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
export default Student_Create;
