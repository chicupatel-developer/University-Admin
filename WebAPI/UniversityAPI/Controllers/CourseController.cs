﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities.Models;
using Entities.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniversityAPI.ViewModels;
using System.IO;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using Entities.DTO;
using Microsoft.AspNetCore.Authorization;

namespace UniversityAPI.Controllers
{
    [Authorize("Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {

        private readonly ICourseRepository _crsRepo;
        private APIResponse _response;

        // ok
        public CourseController(ICourseRepository courseRepo)
        {
            _crsRepo = courseRepo;
        }

        // react ok
        // ok
        [HttpGet]
        [Route("allCourses")]
        public IActionResult GetAllCourses()
        {
            var model = _crsRepo.GetCourses();
            return Ok(model);
        }

        // react ok
        // ok
        [HttpPost]
        [Route("addCourse")]
        public IActionResult AddCourse(Course course)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();

                if (ModelState.IsValid)
                {
                    _crsRepo.AddCourse(course);
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Course Added Successfully!";
                    _response.ResponseError = null;
                }
                else
                {
                    return BadRequest(ModelState);
                }             
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error!";
                _response.ResponseError = ex.Message.ToString();
            }
            return Ok(_response);
        }

        // react ok
        // ok
        // edit course
        [HttpGet]
        [Route("getCourse/{selectedCrsId}")]
        public IActionResult GetCourse(int selectedCrsId)
        {
            var crs = _crsRepo.GetCourse(selectedCrsId);
            return Ok(crs);
        }

        // react ok
        // ok
        // edit in action
        [HttpPost]
        [Route("editCourse")]
        public IActionResult EditCourse(Course course)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();

                if (ModelState.IsValid)
                {
                    Course editedCourse = _crsRepo.EditCourse(course);
                    if (editedCourse == null)
                    {
                        // course not found
                        // data mis-match either at client or server side
                        _response.ResponseCode = -1;
                        _response.ResponseMessage = "Course Not Found @ Server Side!";
                        _response.ResponseError = "Course Not Found @ Server Side!";
                    }
                    else
                    {
                        // success
                        _response.ResponseCode = 0;
                        _response.ResponseMessage = "Course Edited Successfully!";
                        _response.ResponseError = null;
                    }
                }
                else
                {
                    return BadRequest(ModelState);
                }             
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error!";
                _response.ResponseError = ex.Message.ToString();
            }
            return Ok(_response);
        }

        // ok
        // remove course
        [HttpGet]
        [Route("initializeRemoveCourse/{selectedCrsId}")]
        public IActionResult InitializeRemoveCourse(int selectedCrsId)
        {
            var crs = _crsRepo.InitializeRemoveCourse(selectedCrsId);
            return Ok(crs);
        }
        // ok
        // remove in action
        [HttpPost]
        [Route("removeCourse")]
        public IActionResult RemoveCourse(CrsRemoveVM course)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                bool result = _crsRepo.RemoveCourse(course);
                if (result)
                {
                    // success
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Course Removed Successfully!";
                    _response.ResponseError = null;
                }
                else
                {
                    // fail
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Server Error while removing Course!";
                    _response.ResponseError = "Server Error while removing Course!";
                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error while removing Course!";
                _response.ResponseError = "Server Error while removing Course!";
            }
            return Ok(_response);
        }
    }
}
