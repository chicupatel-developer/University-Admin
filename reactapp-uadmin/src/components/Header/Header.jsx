import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, NavDropdown, Nav, Dropdown } from "react-bootstrap";

import Home from "../Home/Home";
import Login from "../Login/Login";
import Register from "../Registration/Registration";
import NotFound from "../NotFound/NotFound";

import "./style.css";

// after login(success), it refreshes the whole page and redirects to home page
// when it refreshes the whole page, Header.jsx also reloads
// and updates current-user's info
import AuthService from "../../services/auth.service";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

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
          <Nav className="me-auto">
            <Link to={"/home"} className="nav-link">
              <i className="bi bi-house-fill"></i>
              Home
            </Link>
            <Link to={"/login"} className="nav-link">
              Login
            </Link>         
          </Nav>
        </Navbar.Collapse>
        {/*
        </Container>
        */}
      </Navbar>
    </>
  );
};

export default Header;
