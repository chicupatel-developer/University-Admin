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
        public IEnumerable<AsmtFacDeptVM> GetAsmtsForStudent(int stdId)
        {
            List<AsmtFacDeptVM> asmts = new List<AsmtFacDeptVM>();

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
                            AsmtFacDeptVM asmt = new AsmtFacDeptVM()
                            {
                                AssignmentId = stdToAsmt.AssignmentId,
                                Title = stdToAsmt.Title,
                                Details = stdToAsmt.Details,
                                FacultyId = stdToAsmt.FacultyId,
                                FacultyName = stdToAsmt.Faculty.FirstName + ", " + stdToAsmt.Faculty.LastName,
                                DepartmentId = stdToAsmt.Faculty.DepartmentId,
                                DepartmentName = stdToAsmt.Faculty.Department.DepartmentName,
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
            }
            else
            {
                // do nothing
            }          
            return asmts;
        }

    }
}
