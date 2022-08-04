import React, { useState, useEffect } from "react";
import "./style.css";
import AuthService from "../../services/auth.service";
import DepartmentService from "../../services/department.service";
import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

import Moment from "moment";

const Department = () => {
  let navigate = useNavigate();

  const [depts, setDepts] = useState([]);

  const getAllDepartments = () => {
    DepartmentService.allDepartments()
      .then((response) => {
        setDepts(response.data);
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
    else getAllDepartments();
  }, []);

  const displayActionBtn = (cell, row) => {
    // console.log(row);
    return (
      <div>
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => editDept(e, row.departmentId)}
        >
          <i className="bi bi-pencil-square"></i>
        </Button>
        &nbsp;
        <Button
          className="btn btn-danger"
          type="button"
          onClick={(e) => removeDept(e, row.departmentId)}
        >
          <i className="bi bi-trash"></i>
        </Button>
      </div>
    );
  };
  const columns = [
    {
      dataField: "departmentId",
      text: "#",
      sort: true,
    },
    {
      dataField: "departmentName",
      text: "Department",
      sort: true,
    },
    {
      dataField: "actions",
      text: "Actions",
      formatter: (cell, row) => displayActionBtn(cell, row),
    },
  ];

  const createNewDept = () => {
    navigate("/department-create");
  };
  const editDept = (e, deptId) => {
    console.log("edit dept : ", deptId);
    navigate("/department-edit/" + deptId);
  };
  const removeDept = (e, deptId) => {
    console.log("remove dept : ", deptId);
    navigate("/department-remove/" + deptId);
  };

  return (
    <div className="container">
      <div className="mainHeader">Departments</div>
      <hr />
      <Button
        className="btn btn-success"
        type="button"
        onClick={(e) => createNewDept(e)}
      >
        Create New Department
      </Button>
      <p></p>
      {depts && depts.length > 0 ? (
        <BootstrapTable
          bootstrap4
          keyField="departmentId"
          data={depts}
          columns={columns}
          pagination={paginationFactory({ sizePerPage: 5 })}
          filter={filterFactory()}
        />
      ) : (
        <div className="noDepts">No Departments!</div>
      )}
    </div>
  );
};

export default Department;
