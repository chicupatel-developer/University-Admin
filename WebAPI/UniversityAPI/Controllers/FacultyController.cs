using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities.Models;
using Entities.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniversityAPI.ViewModels;
using Entities.DTO;
using Microsoft.AspNetCore.Authorization;

namespace UniversityAPI.Controllers
{
    [Authorize("Admin")]
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

        // react ok
        // ok
        [HttpGet]
        [Route("allFaculties")]
        public IActionResult GetAllFaculties()
        {
            var allFaculties = _facRepo.GetFaculties();
            return Ok(allFaculties);
        }

        // react ok
        // ok
        [HttpPost]
        [Route("addFaculty")]
        public IActionResult AddFaculty(Faculty faculty)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();

                if (ModelState.IsValid)
                {
                    _facRepo.AddFaculty(faculty);
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Faculty Added Successfully!";
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
        // edit faculty
        [HttpGet]
        [Route("getFaculty/{selectedFacId}")]
        public IActionResult GetFaculty(int selectedFacId)
        {
            var fac = _facRepo.GetFaculty(selectedFacId);
            return Ok(fac);
        }
        
        // react ok
        // ok
        // edit in action
        [HttpPost]
        [Route("editFaculty")]
        public IActionResult EditFaculty(Faculty faculty)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();

                if (ModelState.IsValid)
                {
                    Faculty editedFaculty = _facRepo.EditFaculty(faculty);
                    if (editedFaculty == null)
                    {
                        // faculty not found
                        // data mis-match either at client or server side
                        _response.ResponseCode = -1;
                        _response.ResponseMessage = "Faculty Not Found @ Server Side!";
                        _response.ResponseError = "Faculty Not Found @ Server Side!";
                    }
                    else
                    {
                        // success
                        _response.ResponseCode = 0;
                        _response.ResponseMessage = "Faculty Edited Successfully!";
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

        // react ok
        // ok
        // remove faculty
        [HttpGet]
        [Route("initializeRemoveFaculty/{selectedFacId}")]
        public IActionResult InitializeRemoveFaculty(int selectedFacId)
        {
            try
            {
                var fac = _facRepo.InitializeRemoveFaculty(selectedFacId);
                return Ok(fac);
            }
            catch (Exception ex)
            {
                return BadRequest("Bad Request! (OR) Server Error!");
            }            
        }

        // react ok
        // ok
        // remove in action
        [HttpPost]
        [Route("removeFaculty")]
        public IActionResult RemoveFaculty(FacRemoveVM faculty)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                bool result = _facRepo.RemoveFaculty(faculty);
                if (result)
                {
                    // success
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Faculty Removed Successfully!";
                    _response.ResponseError = null;
                }
                else
                {
                    // fail
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Server Error while removing Faculty!";
                    _response.ResponseError = "Server Error while removing Faculty!";
                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error while removing Faculty!";
                _response.ResponseError = "Server Error while removing Faculty!";
            }
            return Ok(_response);
        }

    }
}
