using Entities.Models;
using Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Entities.DTO;

namespace DataAccess.EFCore.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly UniversityContext appDbContext;

        public StudentRepository(UniversityContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<Student> GetAllStudents()
        {
            return appDbContext.Students.Include(x => x.StdsToCourses).OrderBy(d => d.FirstName).ToList();
        }    

        public Student AddStudent(Student student)
        {
            var result = appDbContext.Students.Add(student);
            appDbContext.SaveChanges();
            return result.Entity;
        }  
        
        public bool EditCoursesToStudent(List<StdToCourse> stdToCourses)
        {
            try
            {
                if (stdToCourses.Count() >= 1)
                {
                    // first remove
                    var stdsToCrsRemove = appDbContext.StdsToCourses.Where(x => x.StudentId == stdToCourses.FirstOrDefault().StudentId);
                    appDbContext.StdsToCourses.RemoveRange(stdsToCrsRemove);
                    
                    // then add
                    foreach (var stdToCourse in stdToCourses)
                    {
                        appDbContext.StdsToCourses.Add(stdToCourse);
                    }
                    
                    // throw new Exception();

                    appDbContext.SaveChanges();
                }
                else
                {
                }
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }                  
        }

        // returns already assigned courses to student
        public IEnumerable<CourseListVM> GetCoursesForStudent(int stdId)
        {
            List<CourseListVM> courses = new List<CourseListVM>();
            var crs = appDbContext.StdsToCourses.Include(y=>y.Course).Where(x => x.StudentId == stdId);

            if (crs != null)
            {
                foreach (var cr in crs)
                {
                    CourseListVM course = new CourseListVM
                    {
                        CourseId = cr.CourseId,
                        CourseName = cr.Course.CouseName,
                        Checked = true                        
                    };
                    courses.Add(course);
                }
            }
            else
            {
            }
            return courses;
        }

        // returns all possible assignments belong to courses assigned to student
        public IEnumerable<AsmtCrsStdVM> GetAsmtsForStudent(int stdId)
        {
            List<AsmtCrsStdVM> asmts = new List<AsmtCrsStdVM>();

            var stdToCrs = appDbContext.StdsToCourses.Where(a => a.StudentId == stdId);
            if (stdToCrs != null)
            {
                // all courses currently assigned to student
                foreach(var cr in stdToCrs)
                {
                    // retrieve all assignments belong to these courses
                    var stdToAsmts = appDbContext.Assignments.Where(b => b.CourseId == cr.CourseId)
                            .Include(x => x.Faculty).Include(y => y.Faculty.Department).Include(xx => xx.Course);
                    if (stdToAsmts != null)
                    {
                        foreach(var stdToAsmt in stdToAsmts)
                        {
                            AsmtCrsStdVM asmt = new AsmtCrsStdVM()
                            {
                                AssignmentId = stdToAsmt.AssignmentId,
                                Title = stdToAsmt.Title,
                                Details = stdToAsmt.Details,
                                AsmtCreateDate = stdToAsmt.AsmtCreateDate,
                                AsmtLastDate = stdToAsmt.AsmtLastDate,
                                AsmtUploadId = stdToAsmt.AsmtUploadId,
                                CourseId = stdToAsmt.CourseId,
                                CourseName = stdToAsmt.Course.CouseName
                            };
                            asmts.Add(asmt);
                        }                        
                    }
                    else { }
                }

                // load asmt. file name
                foreach (var asmt in asmts)
                {
                    var asmtFileName = appDbContext.AsmtUploads.Where(x => x.AsmtUploadId == asmt.AsmtUploadId).FirstOrDefault();
                    if (asmtFileName != null)
                    {
                        asmt.AsmtFileName = asmtFileName.FileName;
                    }
                }

                // load AsmtLinkStatus
                foreach (var asmt in asmts)
                {
                    var asmtsStatus = appDbContext.StdToAsmt.Where(x => x.AssignmentId == asmt.AssignmentId && x.StudentId==stdId).FirstOrDefault();
                    if (asmtsStatus != null)
                    {
                        asmt.AsmtLinkStatus = asmtsStatus.AsmtLinkStatus;                       
                    }
                    else
                    {                        
                        // course is assigned to student, but course's this assignment is not linked to student
                        // means student has yet not downloaded this assignment of this course
                        asmt.AsmtLinkStatus = AsmtLinkStatus.AsmtNotLinked;
                    }
                }
            }
            else
            {
                // do nothing
            }          
            return asmts;
        }

        // during asmt(course-student) download process
        public bool EditAsmtsToStudent(StdToAsmtDownload stdToAsmtDownload)
        {
            try
            {
                if (stdToAsmtDownload != null)
                {
                    if(appDbContext.StdToAsmt.Where(x=>x.StudentId==stdToAsmtDownload.StudentId && x.AssignmentId==stdToAsmtDownload.AssignmentId).FirstOrDefault()!=null)
                    {
                        // do nothing
                    }
                    else
                    {
                        // add
                        StdToAsmt stdToAsmt = new StdToAsmt();
                        stdToAsmt.AssignmentId = stdToAsmtDownload.AssignmentId;
                        stdToAsmt.StudentId = stdToAsmtDownload.StudentId;
                        stdToAsmt.AsmtLinkStatus = AsmtLinkStatus.AsmtLinked;
                        appDbContext.StdToAsmt.Add(stdToAsmt);
                        appDbContext.SaveChanges();
                    }             
                }
                else
                {
                    // do nothing
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public AsmtSubmitVM AsmtSubmit(AsmtSubmitVM asmtSubmitVM)
        {
            var stdAsmtSubmit = appDbContext.StdToAsmt
                                    .Where(x => x.StudentId == asmtSubmitVM.StudentId && x.AssignmentId == asmtSubmitVM.AssignmentId).FirstOrDefault();
            stdAsmtSubmit.AsmtSubmitDate = asmtSubmitVM.AsmtSubmitDate;
            stdAsmtSubmit.AsmtLinkStatus = asmtSubmitVM.AsmtLinkStatus;
            stdAsmtSubmit.AsmtSubmitFileName = asmtSubmitVM.AsmtSubmitFileName;
            stdAsmtSubmit.AsmtSubmitFilePath = asmtSubmitVM.AsmtSubmitFilePath;

            // throw new Exception();

            appDbContext.SaveChanges();

            return asmtSubmitVM;
        }
    }
}
