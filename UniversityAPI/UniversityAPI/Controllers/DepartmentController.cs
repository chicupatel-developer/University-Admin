using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities.Models;
using Entities.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniversityAPI.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Entities.DTO;

namespace UniversityAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentRepository _deptRepo;
        private APIResponse _response;
        
        // ok
        public DepartmentController(IDepartmentRepository deptRepo)
        {
            _deptRepo = deptRepo;
        }

        // ok        
        [HttpGet]
        [Route("allDepartments")]
        public IActionResult GetAllDepartments()
        {
            var allDepartments = _deptRepo.GetAllDepartments();
            return Ok(allDepartments);
        }

        // ok
        [HttpPost]
        [Route("addDepartment")]
        public IActionResult AddDepartment(Department department)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                _deptRepo.AddDepartment(department);
                _response.ResponseCode = 0;
                _response.ResponseMessage = "Department Added Successfully!";
                _response.ResponseError = null;
            }
            catch(Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error!";
                _response.ResponseError = ex.Message.ToString();
            }
            return Ok(_response);
        }

        // ok
        // edit department
        [HttpGet]
        [Route("getDepartment/{selectedDeptId}")]
        public IActionResult GetDepartment(int selectedDeptId)
        {
            var dept = _deptRepo.GetDepartment(selectedDeptId);
            return Ok(dept);
        }
        // ok
        [HttpPost]
        [Route("editDepartment")]
        public IActionResult EditDepartment(Department department)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                Department editedDepartment = _deptRepo.EditDepartment(department);
                if (editedDepartment == null)
                {
                    // department not found
                    // data mis-match either at client or server side
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Department Not Found @ Server Side!";
                    _response.ResponseError = "Department Not Found @ Server Side!";
                }
                else
                {
                    // success
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Department Edited Successfully!";
                    _response.ResponseError = null;
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
        // remove department
        [HttpGet]
        [Route("initializeRemoveDepartment/{selectedDeptId}")]
        public IActionResult InitializeRemoveDepartment(int selectedDeptId)
        {
            var dept = _deptRepo.InitializeRemoveDepartment(selectedDeptId);
            return Ok(dept);
        }


        // ok
        [HttpPost]
        [Route("removeDepartment")]
        public IActionResult RemoveDepartment(DeptRemoveVM department)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                bool result = _deptRepo.RemoveDepartment(department);
                if (result)
                {
                    // success
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Department Removed Successfully!";
                    _response.ResponseError = null;                   
                }
                else
                {
                    // fail
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Server Error while removing Department!";
                    _response.ResponseError = "Server Error while removing Department!";
                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error while removing Department!";
                _response.ResponseError = "Server Error while removing Department!";
            }
            return Ok(_response);
        }

    }
}
