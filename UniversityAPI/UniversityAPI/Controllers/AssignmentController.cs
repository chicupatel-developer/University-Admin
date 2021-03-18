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
    public class AssignmentController : ControllerBase
    {
        // file upload location settings from appsettings.json
        private readonly IConfiguration _configuration;

        private readonly IAssignmentRepository _asmtRepo;
        private readonly IDepartmentRepository _deptRepo;
        private APIResponse _response;
        
        // ok
        public AssignmentController(IConfiguration configuration, IDepartmentRepository deptRepo, IAssignmentRepository asmtRepo)
        {
            _asmtRepo = asmtRepo;
            _deptRepo = deptRepo;

            _configuration = configuration;            
        }

        // ok
        [HttpGet]
        [Route("allDept")]
        public IActionResult GetAllDept()
        {
            var model = _deptRepo.GetDepartments();
            return Ok(model);
        }

        // ok
        [HttpGet]
        [Route("allAsmtFacDept")]
        public IActionResult GetAllAsmtFacDept()
        {
            var model = _asmtRepo.GetAsmtFacDept();
            return Ok(model);
        }

        // ok
        [HttpGet]
        [Route("allAssignments")]
        public IActionResult GetAllAssignments()
        {
            var allAssignments = _asmtRepo.GetAssignments();
            return Ok(allAssignments);
        }

        // ok
        [HttpGet]
        [Route("listOfFaculties/{selectedDeptId}")]
        public IActionResult ListOfFaculties(int selectedDeptId)
        {
            var listOfFacs = _asmtRepo.GetFacultyList(selectedDeptId);
            return Ok(listOfFacs);
        }

        // ok
        [HttpPost]
        [Route("addAssignment")]
        public IActionResult AddAssignment(Assignment assignment)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                _asmtRepo.AddAssignment(assignment);
                _response.ResponseCode = 0;
                _response.ResponseMessage = "Assignment Added Successfully!";
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

        // ok
        // assignment file upload
        [HttpPost, DisableRequestSizeLimit]
        [Route("upload")]
        public IActionResult Upload()
        {
            try
            {
                string asmtStoragePath = _configuration.GetSection("AsmtUploadLocation").GetSection("Path").Value;


                var file = Request.Form.Files[0];
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), asmtStoragePath);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);                    

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    AsmtUpload model = new AsmtUpload()
                    {
                        FilePath = asmtStoragePath,
                        FileName = fileName
                    };
                    model = _asmtRepo.FileUpload(model);
                    return Ok(new { model });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

    }
}
