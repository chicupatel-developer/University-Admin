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
using System.IO;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;

namespace UniversityAPI.Controllers
{    
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        private readonly IStudentRepository _stdRepo;
        private APIResponse _response;
        
        // ok
        public StudentController(IConfiguration configuration, IStudentRepository stdRepo)
        {
            _stdRepo = stdRepo;

            _configuration = configuration;
        }

        // react ok
        // ok        
        [Authorize("Admin")]
        [HttpGet]
        [Route("allStudents")]
        public IActionResult GetAllStudents()
        {
            var allStudents = _stdRepo.GetAllStudents();
            return Ok(allStudents);
        }
        
        // react ok
        // ok
        [Authorize("Admin")]
        [HttpPost]
        [Route("addStudent")]
        public IActionResult AddStudent(Student student)
        {
            _response = new APIResponse();            
            try
            {
                // throw new Exception();
                if (ModelState.IsValid)
                {
                    _stdRepo.AddStudent(student);
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Student Added Successfully!";
                    _response.ResponseError = null;
                }
                else
                {
                    return BadRequest(ModelState);
                }          
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
        // edit student
        [Authorize("Admin")]
        [HttpGet]
        [Route("getStudent/{selectedStdId}")]
        public IActionResult GetStudent(int selectedStdId)
        {
            var std = _stdRepo.GetStudent(selectedStdId);
            return Ok(std);
        }
        // ok
        // edit in action
        [Authorize("Admin")]
        [HttpPost]
        [Route("editStudent")]
        public IActionResult EditStudent(Student student)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                _stdRepo.EditStudent(student);
                _response.ResponseCode = 0;
                _response.ResponseMessage = "Student Edited Successfully!";
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
        [Authorize("Admin")]
        [HttpPost]
        [Route("editCourseToStd")]
        public IActionResult EditCourseToStd(List<StdToCourse> stdToCourses)
        {
            _response = new APIResponse();            
            if (_stdRepo.EditCoursesToStudent(stdToCourses))
            {
                _response.ResponseCode = 0;
                _response.ResponseMessage = "Course(s) Edited To Student Successfully!";
                _response.ResponseError = null;
            }
            else
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error!";
                _response.ResponseError = "Server Error!";
            }      
            return Ok(_response);
        }

        // ok
        // this will load courses only assigned to respective student
        [Authorize("Admin")]
        [HttpGet]
        [Route("loadCoursesForStudent/{stdId}")]
        public IActionResult LoadCoursesForStudent(int stdId)
        {
            var listOfCrs = _stdRepo.GetCoursesForStudent(stdId);
            return Ok(listOfCrs);
        }

        // ok
        // this will load assignments of selected course to respective student 
        [Authorize("Student")]
        [HttpPost]
        [Route("loadAsmtsForStudentCourse")]
        public IActionResult LoadAsmtsForStudentCourse(AsmtStdCrsVM asmtStdCrsVM)
        {
            var listOfAsmts = _stdRepo.GetAsmtsForStudentCourse(asmtStdCrsVM);
            return Ok(listOfAsmts);
        }

        // ok
        // assignment file download
        [Authorize("Student")]
        [HttpPost, DisableRequestSizeLimit]
        [Route("downloadAsmt")]
        public async Task<IActionResult> Download(StdToAsmtDownload stdToAsmtDownload)
        {
            try
            {
                var currentDirectory = System.IO.Directory.GetCurrentDirectory();
                currentDirectory = currentDirectory + "\\StaticFiles\\Assignments";
                var file = Path.Combine(currentDirectory, stdToAsmtDownload.AsmtFileName);

                // check if file exists or not
                if (System.IO.File.Exists(file))
                {
                    var memory = new MemoryStream();
                    using (var stream = new FileStream(file, FileMode.Open))
                    {
                        await stream.CopyToAsync(memory);
                    }

                    memory.Position = 0;

                    // update db table StdToAsmt
                    _stdRepo.EditAsmtsToStudent(stdToAsmtDownload);


                    // return file for download
                    return File(memory, GetMimeType(file), stdToAsmtDownload.AsmtFileName);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
        private string GetMimeType(string file)
        {
            string extension = Path.GetExtension(file).ToLowerInvariant();
            switch (extension)
            {
                case ".txt": return "text/plain";
                case ".pdf": return "application/pdf";
                case ".doc": return "application/vnd.ms-word";
                case ".docx": return "application/vnd.ms-word";
                case ".xls": return "application/vnd.ms-excel";
                case ".png": return "image/png";
                case ".jpg": return "image/jpeg";
                case ".jpeg": return "image/jpeg";
                case ".gif": return "image/gif";
                case ".csv": return "text/csv";
                default: return "";
            }
        }

        // ok
        // assignment submit
        [Authorize("Student")]
        [HttpPost, DisableRequestSizeLimit]
        [Route("asmtSubmit")]
        public IActionResult AsmtSubmit()
        {
            try
            {
                var stdToAsmtRequest = Request.Form["stdToAsmt"];

                JObject jStdToAsmtRequest = JObject.Parse(stdToAsmtRequest);

                AsmtSubmitVM asmtSubmitVM = new AsmtSubmitVM();
                asmtSubmitVM.AssignmentId = (int)jStdToAsmtRequest["assignmentId"];
                asmtSubmitVM.StudentId = (int)jStdToAsmtRequest["studentId"];

                string asmtStoragePath =_configuration.GetSection("AsmtSubmitLocation").GetSection("Path").Value;

                // unique random number to edit file name
                var guid = Guid.NewGuid();
                var bytes = guid.ToByteArray();
                var rawValue = BitConverter.ToInt64(bytes, 0);
                var inRangeValue = Math.Abs(rawValue) % DateTime.MaxValue.Ticks;


                var file = Request.Form.Files[0];
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), asmtStoragePath);

                if (file.Length > 0)
                {
                    var fileName = inRangeValue + "_" + ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    
                    asmtSubmitVM.AsmtSubmitFilePath = asmtStoragePath;
                    asmtSubmitVM.AsmtSubmitFileName = fileName;
                    asmtSubmitVM.AsmtSubmitDate = DateTime.Now;
                    asmtSubmitVM.AsmtLinkStatus = AsmtLinkStatus.AsmtSubmitted;

                    asmtSubmitVM = _stdRepo.AsmtSubmit(asmtSubmitVM);
                    if(asmtSubmitVM!=null)
                        return Ok(new { asmtSubmitVM });
                    else
                        return StatusCode(500, new { Message = "First Download Asmt. File Please!" });
                }
                else
                {
                    return StatusCode(400, new { Message = "Bad Request!" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Server Error!" });
            }
        }
                
        [Authorize("Student")]
        [HttpGet]
        [Route("getMyCourses/{stdId}")]
        public IActionResult GetMyCourses(int stdId)
        {
            var listOfCrs = _stdRepo.GetMyCourses(stdId);
            return Ok(listOfCrs);
        }

        // react ok
        // @registration process
        // returns students those are yet not linked to ApplicationUser
        // means students with StudentUserId is null
        // ok           
        [HttpGet]
        [Route("allStudentsNotLinkedToApplicationUser")]
        public IActionResult AllStudentsNotLinkedToApplicationUser()
        {
            var allStudents = _stdRepo.GetStudentsNotLinkedToApplicationUser();
            return Ok(allStudents);
        }

        // ok
        // remove student
        [HttpGet]
        [Route("initializeRemoveStudent/{selectedStdId}")]
        public IActionResult InitializeRemoveStudent(int selectedStdId)
        {
            var std = _stdRepo.InitializeRemoveStudent(selectedStdId);
            return Ok(std);
        }
        // ok
        // remove in action
        [HttpPost]
        [Route("removeStudent")]
        public IActionResult RemoveStudent(StdRemoveVM student)
        {
            _response = new APIResponse();
            try
            {
                // throw new Exception();
                bool result = _stdRepo.RemoveStudent(student);
                if (result)
                {
                    // success
                    _response.ResponseCode = 0;
                    _response.ResponseMessage = "Student Removed Successfully!";
                    _response.ResponseError = null;
                }
                else
                {
                    // fail
                    _response.ResponseCode = -1;
                    _response.ResponseMessage = "Server Error while removing Student!";
                    _response.ResponseError = "Server Error while removing Student!";
                }
            }
            catch (Exception ex)
            {
                _response.ResponseCode = -1;
                _response.ResponseMessage = "Server Error while removing Student!";
                _response.ResponseError = "Server Error while removing Student!";
            }
            return Ok(_response);
        }
    }
}
