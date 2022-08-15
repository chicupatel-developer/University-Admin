import React, { useState, useEffect } from "react";
import "./style.css";

const Home = () => {
  return (
    <div className="mainContainer">
      <div className="homePageHeader">
        <h3>University-Admin</h3>
        <h5>
          Web API Core / EF Core / SQL Server / Angular / React / JWT
          Authentication / Google oauth2 Authentication
        </h5>
      </div>
      <hr />
      <p></p>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div>
            <div className="titleHeader">
              <b>Login [Any Registered User]</b>
            </div>
            <p></p>
            <div className="titleBody">
              <ul>
                <li>Custom JWT Authentication (UserName/Password)</li>
                <li>Google oauth2 Authentication</li>
              </ul>
            </div>
            <p></p>
          </div>
          <div>
            <div className="titleHeader">
              <b>Registration</b>
            </div>
            <p></p>
            <div className="titleBody">
              <ul>
                <li>[Admin] Role - Maps User's Profile with Admin Role</li>
                <li>
                  [Student] Role - Maps Student's Profile with Student Role
                </li>
              </ul>
            </div>
            <p></p>
          </div>
          <div>
            <div className="titleHeader">
              <b>Student - Role</b>
            </div>
            <p></p>
            <div className="titleBody">
              <ul>
                <li>
                  My-Courses
                  <ul>
                    <li>List of Courses And Related Faculties (View)</li>
                    <li>
                      List of Assignments Related To Assigned Courses (View)
                      <ul>
                        <li>Download Assignment</li>
                        <li>
                          Submit Assignment [Submit Assignment Not Possible
                          before Download Assignment]
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <p></p>
            <hr />
          </div>
        </div>
        <div className="col-md-6 mx-auto">
          <div>
            <div className="titleHeader">
              <b>Admin - Role</b>
            </div>
            <p></p>
            <div className="titleBody">
              <ul>
                <li>Department (CRUD)</li>
                <li>Faculty (CRUD)</li>
                <li>Course (CRUD)]</li>
                <li>Student (CRUD)</li>
                <li>Map Student To Courses</li>
                <li>
                  Assignment (Add)
                  <ul>
                    <li>File Upload</li>
                    <li>Assignment Details Post</li>
                    <li>Map Assignment To Department-Faculty-Course</li>
                  </ul>
                </li>
                <li>Assignment (View)</li>
                <li>Assignment (Search By Department And/Or Faculty)</li>
                <li>Assignment (Download)</li>
              </ul>
            </div>
            <p></p>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
