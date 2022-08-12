import React, { useState, useEffect } from "react";
import "./style.css";
import AuthService from "../../services/auth.service";
import StudentService from "../../services/student.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

import Moment from "moment";

import { getGender, getGenderStyle } from "../../services/local.service";

const Student = () => {
  return <div className="container">Stduent List</div>;
};

export default Student;
