import React, { useState, useEffect } from "react";
import "./style.css";
import AuthService from "../../services/auth.service";
import FacultyService from "../../services/faculty.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

import Moment from "moment";

import { getGender, getGenderStyle } from "../../services/local.service";

const Faculty = () => {
  let navigate = useNavigate();

  const [facs, setFacs] = useState([]);

  const getAllFaculties = () => {
    FacultyService.allFaculties()
      .then((response) => {
        setFacs(response.data);
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

  useEffect(() => {
    var currRole = AuthService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else getAllFaculties();
  }, []);

  const displayActionBtn = (cell, row) => {
    // console.log(row);
    return (
      <div>
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => editFac(e, row.facultyId)}
        >
          <i className="bi bi-pencil-square"></i>
        </Button>
        &nbsp;
        <Button
          className="btn btn-danger"
          type="button"
          onClick={(e) => removeFac(e, row.facultyId)}
        >
          <i className="bi bi-trash"></i>
        </Button>
      </div>
    );
  };
  const displayName = (cell, row) => {
    return (
      <span>
        {row.firstName} , {row.lastName}
      </span>
    );
  };
  const displayGender = (cell, row) => {
    return (
      <span
        style={{ color: getGenderStyle(cell) }}
      >
        {getGender(cell)}
      </span>
    );
  };
  const columns = [
    {
      dataField: "facultyId",
      text: "#",
      sort: true,
    },
    {
      dataField: "firstName",
      text: "Name",
      sort: true,
      formatter: (cell, row) => displayName(cell, row),
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
    },
    {
      dataField: "phoneNumber",
      text: "Phone",
      sort: true,
    },
    {
      dataField: "gender",
      text: "Gender",
      sort: true,
      formatter: (cell, row) => displayGender(cell, row),
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => displayActionBtn(cell, row),
    },
  ];

  const createNewFac = () => {
    navigate("/faculty-create");
  };
  const editFac = (e, facId) => {
    console.log("edit fac : ", facId);
    navigate("/faculty-edit/" + facId);
  };
  const removeFac = (e, facId) => {
    console.log("remove fac : ", facId);
    navigate("/faculty-remove/" + facId);
  };

  return (
    <div className="container">
      <div className="mainHeader">Faculties</div>
      <hr />
      <Button
        className="btn btn-success"
        type="button"
        onClick={(e) => createNewFac(e)}
      >
        Create New Faculty
      </Button>
      <p></p>
      {facs && facs.length > 0 ? (
        <BootstrapTable
          bootstrap4
          keyField="facultyId"
          data={facs}
          columns={columns}
          pagination={paginationFactory({ sizePerPage: 5 })}
          filter={filterFactory()}
        />
      ) : (
        <div className="noFacs">No Faculty!</div>
      )}
    </div>
  );
};

export default Faculty;
