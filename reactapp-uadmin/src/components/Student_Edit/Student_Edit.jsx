import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";

import { useNavigate } from "react-router";

import Moment from "moment";

const Student_Edit = () => {
  let navigate = useNavigate();

  let { id } = useParams();
  const [genders, setGenders] = useState([]);

  const [modelErrors, setModelErrors] = useState([]);
  const [studentEditResponse, setStudentEditResponse] = useState({});

  // form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [homePostalCode, setHomePostalCode] = useState("");
  const [mailAddress, setMailAddress] = useState("");
  const [mailPostalCode, setMailPostalCode] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else {
      setGenders(["Male", "Female", "Other"]);
      getStudent(id);
    }
  }, []);

  const getStudent = (id) => {
    console.log("Editing student : ", id);
    if (checkForNumbersOnly(id)) {
      StudentService.getStudent(id)
        .then((response) => {
          if (response.data === "") {
            // data not found on server!
            var studentEditResponse = {
              responseCode: -1,
              responseMessage: "Student Not Found!",
            };

            setStudentEditResponse(studentEditResponse);
          } else {
            console.log(response.data);

            setFirstName(response.data.firstName);
            setLastName(response.data.lastName);
            response.data.phoneNumber !== null
              ? setPhoneNumber(response.data.phoneNumber)
              : setPhoneNumber("");
            setEmail(response.data.email);
            setGender(convertGenderForDisplay(response.data.gender));
            response.data.homeAddress !== null
              ? setHomeAddress(response.data.homeAddress)
              : setHomeAddress("");
            response.data.homePostalCode !== null
              ? setHomePostalCode(response.data.homePostalCode)
              : setHomePostalCode("");
            response.data.mailAddress !== null
              ? setMailAddress(response.data.mailAddress)
              : setMailAddress("");
            response.data.mailPostalCode !== null
              ? setMailPostalCode(response.data.mailPostalCode)
              : setMailPostalCode("");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else navigate("/student");
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
  const handleHomeAddress = (event) => {
    setHomeAddress(event.target.value);
    if (!errors[homeAddress])
      setErrors({
        ...errors,
        homeAddress: "",
      });
  };
  const handleHomePostalCode = (event) => {
    setHomePostalCode(event.target.value);
    if (!errors[homePostalCode])
      setErrors({
        ...errors,
        homePostalCode: "",
      });
  };
  const handleMailAddress = (event) => {
    setMailAddress(event.target.value);
    if (!errors[mailAddress])
      setErrors({
        ...errors,
        mailAddress: "",
      });
  };
  const handleMailPostalCode = (event) => {
    setMailPostalCode(event.target.value);
    if (!errors[mailPostalCode])
      setErrors({
        ...errors,
        mailPostalCode: "",
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
      var studentModel = {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        gender: convertGender(gender),
        homeAddress:
          homeAddress !== "" || homeAddress !== undefined ? homeAddress : "",
        homePostalCode:
          homePostalCode !== "" || homePostalCode !== undefined
            ? homePostalCode
            : "",
        mailAddress:
          mailAddress !== "" || mailAddress !== undefined ? mailAddress : "",
        mailPostalCode:
          mailPostalCode !== "" || mailPostalCode !== undefined
            ? mailPostalCode
            : "",
        studentId: Number(id),
      };

      console.log(studentModel);

      // api call
      StudentService.editStudent(studentModel)
        .then((response) => {
          console.log(response.data);
          setModelErrors([]);
          setStudentEditResponse({});
          var studentEditResponse = {
            responseCode: response.data.responseCode,
            responseMessage: response.data.responseMessage,
          };

          resetForm();
          setStudentEditResponse(studentEditResponse);
          if (response.data.responseCode === 0) {
            setTimeout(() => {
              navigate("/student");
            }, 3000);
          }
        })
        .catch((error) => {
          setModelErrors([]);
          setStudentEditResponse({});
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
    setHomeAddress("");
    setHomePostalCode("");
    setMailAddress("");
    setMailPostalCode("");
    setStudentEditResponse({});
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
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-header header">
                <h3>Edit Student # {id}</h3>
                <p></p>{" "}
                {studentEditResponse &&
                studentEditResponse.responseCode === -1 ? (
                  <span className="studentEditError">
                    {studentEditResponse.responseMessage}
                  </span>
                ) : (
                  <span className="studentEditSuccess">
                    {studentEditResponse.responseMessage}
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
                      <p></p>
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
                    </div>
                    <div className="col-md-5 mx-auto">
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
                      <Form.Group controlId="homeAddress">
                        <Form.Label>Home Address</Form.Label>
                        <Form.Control
                          value={homeAddress}
                          type="text"
                          isInvalid={!!errors.homeAddress}
                          onChange={(e) => handleHomeAddress(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.homeAddress}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="homePostalCode">
                        <Form.Label>Home Postal Code</Form.Label>
                        <Form.Control
                          value={homePostalCode}
                          type="text"
                          isInvalid={!!errors.homePostalCode}
                          onChange={(e) => handleHomePostalCode(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.homePostalCode}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>{" "}
                      <Form.Group controlId="mailAddress">
                        <Form.Label>Mail Address</Form.Label>
                        <Form.Control
                          value={mailAddress}
                          type="text"
                          isInvalid={!!errors.mailAddress}
                          onChange={(e) => handleMailAddress(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.mailAddress}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="mailAPostalCode">
                        <Form.Label>Mail Postal Code</Form.Label>
                        <Form.Control
                          value={mailPostalCode}
                          type="text"
                          isInvalid={!!errors.mailPostalCode}
                          onChange={(e) => handleMailPostalCode(e)}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.mailPostalCode}
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
                      Edit Student
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
export default Student_Edit;
