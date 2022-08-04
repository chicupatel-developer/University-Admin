import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";

import { useNavigate } from "react-router";

import { getRoles } from "../../services/local.service";

const Registration = () => {
  let navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [modelErrors, setModelErrors] = useState([]);

  const [registerResponse, setRegisterResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    var currUser = AuthService.getCurrentUser();
    if (currUser !== null) navigate("/home");
    else setRoles(getRoles());
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

  const findFormErrors = () => {
    const { myRole, username, email, password, confirmPassword } = form;
    const newErrors = {};

    if (!myRole || myRole === "") newErrors.myRole = "Role is Required!";

    if (!username || username === "")
      newErrors.username = "User Name is Required!";

    var pattern = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!email || email === "") newErrors.email = "Email is Required!";
    else if (!pattern.test(email)) newErrors.email = "Invalid Email Address!";

    if (!password || password === "")
      newErrors.password = "Password is Required!";

    if (!confirmPassword || confirmPassword === "")
      newErrors.confirmPassword = "Confirm Password is Required!";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords don't match!";

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
      var registerModel = {
        email: form.email,

        // check for ModelState @api
        // email: null,

        password: form.password,
        confirmPassword: form.confirmPassword,
        username: form.username,
        studentId: 0, // when app-role===Admin
      };

      console.log(registerModel);

      // api call
      AuthService.register(registerModel, form.myRole)
        .then((response) => {
          console.log(response.data);
          var registerResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };
          resetForm();
          setRegisterResponse(registerResponse);

          setTimeout(() => {
            navigate("/login");
          }, 3000);
        })
        .catch((error) => {
          setModelErrors([]);
          setRegisterResponse({});
          console.log(error.response.data.message);
          console.log(error.response);

          // 500
          if (error.response.status === 500) {
            var registerResponse = {
              responseCode: -1,
              responseMessage: error.response.data.message,
            };
            setRegisterResponse(registerResponse);
            console.log(registerResponse);
          }
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
    setRegisterResponse({});
    setModelErrors([]);
  };

  const renderOptionsForRole = () => {
    return roles.map((dt, i) => {
      return (
        <option value={dt.name} key={i} name={dt.name}>
          {dt.name}
        </option>
      );
    });
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

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-header">
                <h3>
                  <i className="bi bi-person-circle"></i> &nbsp; Registration
                </h3>
                <p></p>
                {registerResponse && registerResponse.responseCode === -1 ? (
                  <span className="registerError">
                    {registerResponse.responseMessage}
                  </span>
                ) : (
                  <span className="registerSuccess">
                    {registerResponse.responseMessage}
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
                    <div className="col-sm-6">
                      <Form.Group controlId="myRole">
                        <Form.Label>App Role</Form.Label>
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.myRole}
                          onChange={(e) => {
                            setField("myRole", e.target.value);
                          }}
                        >
                          {renderOptionsForRole()}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.myRole}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="username">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control
                          type="text"
                          isInvalid={!!errors.username}
                          onChange={(e) => setField("username", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-sm-6">
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
                      <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          isInvalid={!!errors.password}
                          onChange={(e) => setField("password", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          isInvalid={!!errors.confirmPassword}
                          onChange={(e) =>
                            setField("confirmPassword", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
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
                      Register
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
export default Registration;
