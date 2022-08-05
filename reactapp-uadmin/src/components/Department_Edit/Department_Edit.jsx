import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import DepartmentService from "../../services/department.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Department_Edit = () => {
  let navigate = useNavigate();

  let { id } = useParams();

  const [modelErrors, setModelErrors] = useState([]);

  const [deptEditResponse, setDeptEditResponse] = useState({});

  // form
  const [departmentName, setDepartmentName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else getDepartment(id);
  }, []);

  const getDepartment = (id) => {
    console.log("Editing department : ", id);
    if (checkForNumbersOnly(id)) {
      DepartmentService.getDepartment(id)
        .then((response) => {
          if (response.data === "") {
            // data not found on server!
            var deptEditResponse = {
              responseCode: -1,
              responseMessage: "Department Not Found!",
            };

            setDeptEditResponse(deptEditResponse);
          } else {
            console.log(response.data);

            setDepartmentName(response.data.departmentName);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else navigate("/department");
  };

  // reset form
  // form reference
  const formRef = useRef(null);

  const handleDepartmentName = (event) => {
    setDepartmentName(event.target.value);
    if (!errors[departmentName])
      setErrors({
        ...errors,
        departmentName: "",
      });
  };

  const checkForNumbersOnly = (newVal) => {
    const re = /^\d*\.?\d*$/;
    if (re.test(newVal)) return true;
    else return false;
  };

  const findFormErrors = () => {
    const newErrors = {};

    if (!departmentName || departmentName === "")
      newErrors.departmentName = "Department Name is Required!";

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
      var deptModel = {
        // check for ModelState @api
        departmentName: departmentName,
        // departmentName: null,
        departmentId: parseInt(id),
      };

      console.log(deptModel);

      // api call
      DepartmentService.editDepartment(deptModel)
        .then((response) => {
          console.log(response.data);
          setModelErrors([]);
          setDeptEditResponse({});
          var deptEditResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };

          resetForm();
          setDeptEditResponse(deptEditResponse);
          if (response.data.responseCode === 0) {
            setTimeout(() => {
              navigate("/department");
            }, 3000);
          }
        })
        .catch((error) => {
          setModelErrors([]);
          setDeptEditResponse({});
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
    setDepartmentName("");
    setDeptEditResponse({});
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
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-header header">
                <h3>Edit Department # {id}</h3>
                <p></p>{" "}
                {deptEditResponse && deptEditResponse.responseCode === -1 ? (
                  <span className="deptEditError">
                    {deptEditResponse.responseMessage}
                  </span>
                ) : (
                  <span className="deptEditSuccess">
                    {deptEditResponse.responseMessage}
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
                    <div className="col-md-6 mx-auto">
                      <Form.Group controlId="departmentName">
                        <Form.Label>Department Name</Form.Label>
                        <Form.Control
                          value={departmentName}
                          type="text"
                          isInvalid={!!errors.departmentName}
                          onChange={(e) => handleDepartmentName(e)}
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
                      Edit Department
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
export default Department_Edit;
