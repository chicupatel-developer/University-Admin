import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, NavDropdown, Nav, Dropdown } from "react-bootstrap";

import Home from "../Home/Home";
import Login from "../Login/Login";
import Register from "../Registration/Registration";
import NotFound from "../NotFound/NotFound";
import Department from "../Department/Department";

import "./style.css";

// after login(success), it refreshes the whole page and redirects to home page
// when it refreshes the whole page, Header.jsx also reloads
// and updates current-user's info
import AuthService from "../../services/auth.service";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [currentUserToken, setCurrentUserToken] = useState("");

  // use this when navigate("/home"); used previously @login page
  /*
  useEffect(() => {
    var currUser = AuthService.getCurrentUser();

    if (currUser != null) {
      setCurrentUserName(currUser.userName);
      setCurrentUserRole(currUser.role);
      setCurrentUserToken(currUser.token);
    } else {
      console.log("not logged in yet!");
    }
  });
  */

  // use this when window.location.reload("/home", true);
  // used previously @login page
  useEffect(() => {
    var currUser = AuthService.getCurrentUser();

    if (currUser != null) {
      setCurrentUserName(currUser.userName);
      setCurrentUserRole(currUser.role);
      setCurrentUserToken(currUser.token);
    } else {
      console.log("not logged in yet!");
    }
  }, []);

  const logout = () => {
    AuthService.logout();
    setCurrentUserName("");
    setCurrentUserRole("");
    setCurrentUserToken("");
  };

  return (
    <>
      <Navbar variant="light" expand="lg" sticky="top" className="navBar">
        {/*
        <Container>
        */}

        <Navbar.Brand href="/home">
          <span>University</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {currentUserName && currentUserRole === "Admin" ? (
            <Nav className="me-auto">
              <Link to={"/home"} className="nav-link">
                <i className="bi bi-house-fill"></i>
                Home
              </Link>
              <Link to={"/department"} className="nav-link">
                <i className="bi bi-building"></i>
                Department
              </Link>
              <Link to={"/faculty"} className="nav-link">
                <i className="bi bi-person-lines-fill"></i>
                Faculty
              </Link>
            </Nav>
          ) : (
            <span></span>
          )}

          {currentUserName && currentUserRole === "Student" ? (
            <Nav className="me-auto">
              <Link to={"/home"} className="nav-link">
                <i className="bi bi-house-fill"></i>
                Home
              </Link>
            </Nav>
          ) : (
            <span></span>
          )}

          {currentUserName ? (
            <Nav>
              <a href="/login" onClick={() => logout()} className="nav-link">
                <h6>
                  <b>
                    [<span className="userRole">({currentUserRole})</span>{" "}
                    {currentUserName} ]LogOut{" "}
                  </b>
                </h6>
              </a>
            </Nav>
          ) : (
            <Nav>
              <Link to={"/login"} className="nav-link">
                <i className="bi bi-box-arrow-in-right"></i>Login
              </Link>
              <Link to={"/registration"} className="nav-link">
                <i className="bi bi-person-circle"></i>Registration
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
        {/*
        </Container>
        */}
      </Navbar>
    </>
  );
};

export default Header;
