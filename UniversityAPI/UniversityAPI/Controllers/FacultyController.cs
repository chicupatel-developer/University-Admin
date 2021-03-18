using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities.Models;
using Entities.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniversityAPI.ViewModels;

namespace UniversityAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacultyController : ControllerBase
    {
        private readonly IFacultyRepository _facRepo;
        private APIResponse _response;

        // ok
        public FacultyController(IFacultyRepository facRepo)
        {
            _facRepo = facRepo;
        }

        // ok
        [HttpGet]
        [Route("allFaculties")]
        public IActionResult GetAllFaculties()
        {
            var allFaculties = _facRepo.GetFaculties();
            return Ok(allFaculties);
        }

        // ok
        [HttpPost]
        [Route("addFaculty")]
        public IActionResult AddFaculty(Faculty faculty)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                _facRepo.AddFaculty(faculty);
                _response.ResponseCode = 0;
                _response.ResponseMessage = "Faculty Added Successfully!";
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
