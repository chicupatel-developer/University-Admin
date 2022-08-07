import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import FacultyService from "../../services/department.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Faculty_Create = () => {
  let navigate = useNavigate();

  const [genders, setGenders] = useState([]);

  const [modelErrors, setModelErrors] = useState([]);

  const [facCreateResponse, setFacCreateResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      setGenders(["Male", "Female"]);
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
    const re = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const findFormErrors = () => {
    const { firstName, lastName, phoneNumber, email, gender, departmentId } =
      form;
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

    if (!gender || gender === "") newErrors.gender = "Gender is Required!";

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
      var facModel = {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        email: form.email,
        gender: form.gender,
        departmentId: form.departmentId,
      };

      console.log(facModel);
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setFacCreateResponse({});
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
                <h3>Create New Department</h3>
                <p></p>{" "}
                {facCreateResponse && facCreateResponse.responseCode === -1 ? (
                  <span className="facCreateError">
                    {facCreateResponse.responseMessage}
                  </span>
                ) : (
                  <span className="facCreateSuccess">
                    {facCreateResponse.responseMessage}
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
                      <p></p>
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
                      Create Department
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
export default Faculty_Create;
