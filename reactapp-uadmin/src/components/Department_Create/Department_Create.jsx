import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import DepartmentService from "../../services/department.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Department_Create = () => {
  let navigate = useNavigate();

  const [modelErrors, setModelErrors] = useState([]);

  const [deptCreateResponse, setDeptCreateResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
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
    const { departmentName } = form;
    const newErrors = {};

    if (!departmentName || departmentName === "")
      newErrors.departmentName = "Department Name is Required!";

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
      var deptModel = {
        departmentName: form.departmentName,
        // departmentName: null,
      };

      console.log(deptModel);

      // api call
      DepartmentService.createDepartment(deptModel)
        .then((response) => {
          setModelErrors([]);
          setDeptCreateResponse({});
          console.log(response.data);

          var deptCreateResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };
          if (response.data.responseCode === 0) {
            resetForm();
            setDeptCreateResponse(deptCreateResponse);

            setTimeout(() => {
              navigate("/department");
            }, 3000);
          } else if (response.data.responseCode === -1) {
            setDeptCreateResponse(deptCreateResponse);
          }
        })
        .catch((error) => {
          console.log(error);
          setModelErrors([]);
          setDeptCreateResponse({});
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
    setDeptCreateResponse({});
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

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-9 mx-auto">
            <div className="card">
              <div className="card-header">
                <h3>Create New Department</h3>
                <p></p>{" "}
                {deptCreateResponse &&
                deptCreateResponse.responseCode === -1 ? (
                  <span className="deptCreateError">
                    {deptCreateResponse.responseMessage}
                  </span>
                ) : (
                  <span className="deptCreateSuccess">
                    {deptCreateResponse.responseMessage}
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
                      <Form.Group controlId="departmentName">
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control
                          type="text"
                          isInvalid={!!errors.departmentName}
                          onChange={(e) =>
                            setField("departmentName", e.target.value)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.departmentName}
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
export default Department_Create;
