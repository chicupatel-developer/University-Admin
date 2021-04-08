using System;
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

namespace UniversityAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {

        private readonly ICourseRepository _courseRepo;
        private APIResponse _response;

        // ok
        public CourseController(ICourseRepository courseRepo)
        {
            _courseRepo = courseRepo;
        }

        // ok
        [HttpGet]
        [Route("allCourses")]
        public IActionResult GetAllCourses()
        {
            var model = _courseRepo.GetCourses();
            return Ok(model);
        }

        // ok
        [HttpPost]
        [Route("addCourse")]
        public IActionResult AddCourse(Course course)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                _courseRepo.AddCourse(course);
                _response.ResponseCode = 0;
                _response.ResponseMessage = "Course Added Successfully!";
                _response.ResponseError = null;
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error!";
                _response.ResponseError = ex.Message.ToString();
            }
            return Ok(_response);
        }

    }
}
