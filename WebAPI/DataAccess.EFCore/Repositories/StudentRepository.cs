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

        // ok
        public StudentRepository(UniversityContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        // ok
        // returns students those are yet not linked to ApplicationUser
        // means students with StudentUserId is null
        public IEnumerable<Student> GetStudentsNotLinkedToApplicationUser()
        {
            return appDbContext.Students.Where(x=>x.StudentUserId==null).OrderBy(d => d.FirstName).ToList();
        }

        // ok
        public IEnumerable<Student> GetAllStudents()
        {
            return appDbContext.Students.Include(x => x.StdsToCourses).OrderBy(d => d.FirstName).ToList();
        }    

        // ok
        public Student AddStudent(Student student)
        {
            var result = appDbContext.Students.Add(student);
            appDbContext.SaveChanges();
            return result.Entity;
        }

        // ok
        public Student GetStudent(int stdId)
        {
            var std = appDbContext.Students.Where(x => x.StudentId == stdId).FirstOrDefault();
            return std;
        }

        // ok
        public Student EditStudent(Student student)
        {
            var result = appDbContext.Students.Where(x => x.StudentId == student.StudentId).FirstOrDefault();
            result.Email = student.Email;
            result.FirstName = student.FirstName;
            result.HomeAddress = student.HomeAddress;
            result.HomePostalCode = student.HomePostalCode;
            result.LastName = student.LastName;
            result.MailAddress = student.MailAddress;
            result.MailPostalCode = student.MailPostalCode;
            result.PhoneNumber = student.PhoneNumber;
            result.Gender = student.Gender;

            appDbContext.SaveChanges();
            return result;
        }

        // ok
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

        // ok
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

        // ok
        // this will load assignments of selected course to respective student 
        public IEnumerable<AsmtCrsStdVM> GetAsmtsForStudentCourse(AsmtStdCrsVM asmtStdCrsVM)
        {
            List<AsmtCrsStdVM> asmts = new List<AsmtCrsStdVM>();

            var stdToCrs = appDbContext.StdsToCourses.Where(a => a.StudentId == asmtStdCrsVM.StudentId && a.CourseId== asmtStdCrsVM.CourseId);
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
                    var asmtsStatus = appDbContext.StdToAsmt.Where(x => x.AssignmentId == asmt.AssignmentId && x.StudentId== asmtStdCrsVM.StudentId).FirstOrDefault();
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

        // ok
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

        // ok
        // Student - Assignment submit
        public AsmtSubmitVM AsmtSubmit(AsmtSubmitVM asmtSubmitVM)
        {
            var stdAsmtSubmit = appDbContext.StdToAsmt
                                    .Where(x => x.StudentId == asmtSubmitVM.StudentId && x.AssignmentId == asmtSubmitVM.AssignmentId).FirstOrDefault();
            if (stdAsmtSubmit != null)
            {
                stdAsmtSubmit.AsmtSubmitDate = asmtSubmitVM.AsmtSubmitDate;
                stdAsmtSubmit.AsmtLinkStatus = asmtSubmitVM.AsmtLinkStatus;
                stdAsmtSubmit.AsmtSubmitFileName = asmtSubmitVM.AsmtSubmitFileName;
                stdAsmtSubmit.AsmtSubmitFilePath = asmtSubmitVM.AsmtSubmitFilePath;

                // to check @last minute exception
                // throw new Exception();

                appDbContext.SaveChanges();

                return asmtSubmitVM;
            }
            else
                return null;          
        }

        // ok
        // Student : user
        public StdCrsFacVM GetMyCourses(int stdId)
        {
            StdCrsFacVM myCourses = new StdCrsFacVM();
            List<StdCrsVM> courses = new List<StdCrsVM>();
            myCourses.MyCourses = courses;
            myCourses.StudentId = stdId;

            var crs = appDbContext.StdsToCourses.Include(y=>y.Course)
                            .Where(x => x.StudentId == stdId);
            if (crs != null)
            {
                foreach(var cr in crs)
                {
                    var fac = appDbContext.Faculties
                                .Where(q => q.FacultyId == cr.Course.FacultyId).FirstOrDefault();
                    courses.Add(new StdCrsVM()
                    {
                         CourseId = cr.CourseId,
                         CourseName = cr.Course.CouseName,
                         FacultyId = cr.Course.FacultyId,
                         FacultyName = fac.FirstName + ", "+ fac.LastName
                    });
                }
            }
            else
            {
                // do nothing
            }
            return myCourses;
        }

        // ok
        // updating StudentUserId column value by Id column value of ApplicationUser
        public void ConnectApplicationUserToStudent(string Id, int stdId)
        {
            var std = appDbContext.Students
                        .Where(x => x.StudentId == stdId).FirstOrDefault();
            if (std != null)
            {
                std.StudentUserId = Id;
                appDbContext.SaveChanges();
            }
        }

        // ok
        public Student GetStudentLoginProcess(string id)
        {
            var std = appDbContext.Students.Where(x => x.StudentUserId == id).FirstOrDefault();
            return std;
        }

        // ok
        public StdRemoveVM InitializeRemoveStudent(int stdId)
        {
            StdRemoveVM stdRemoveVM = new StdRemoveVM();
            List<StdCrsRemoveVM> courses = new List<StdCrsRemoveVM>();
            List<StdAsmtRemoveVM> assignments = new List<StdAsmtRemoveVM>();

            stdRemoveVM.Courses = courses;
            stdRemoveVM.Assignments = assignments;

            // check for course dependancy
            var crs = appDbContext.StdsToCourses.Include(y=>y.Course).Where(x => x.StudentId == stdId);
            if (crs != null)
            {
                // course found
                // send warning to user @ student remove action
                foreach (var cr in crs)
                {
                    courses.Add(new StdCrsRemoveVM
                    {
                        CourseId = cr.CourseId,
                        CourseName = cr.Course.CouseName
                    });
                }
            }
            else
            {
                // do nothing
            }

            if (stdRemoveVM.Courses.Count() >= 1)
            {
                // check for assignment dependancy
                var asmts = appDbContext.StdToAsmt.Include(y => y.Assignment).Where(x => x.StudentId == stdId);
                if (asmts != null)
                {
                    // assignment found
                    // send warning to user @ student remove action
                    foreach (var asmt in asmts)
                    {
                        assignments.Add(new StdAsmtRemoveVM
                        {
                            AssignmentId = asmt.AssignmentId,
                            AsmtTitle = asmt.Assignment.Title,
                            AsmtDetails = asmt.Assignment.Details
                        });
                    }
                }
                else
                {
                    // do nothing
                }
            }
            else
            {
                // do nothing
            }

            var std = appDbContext.Students.Where(x => x.StudentId == stdId).FirstOrDefault();
            if ((stdRemoveVM.Courses.Count() >= 1) || (stdRemoveVM.Assignments.Count() >= 1))
            {
                stdRemoveVM.ErrorCode = -1;
                stdRemoveVM.ErrorMessage = "Database Dependancy Found. Force Remove Action?";
                stdRemoveVM.StudentId = stdId;                
                stdRemoveVM.StudentName = std.FirstName + ", " + std.LastName;
            }
            else
            {
                stdRemoveVM.ErrorCode = 0;
                stdRemoveVM.ErrorMessage = "Ready To Remove student?";
                stdRemoveVM.StudentId = stdId;
                stdRemoveVM.StudentName = std.FirstName + ", " + std.LastName;
            }
            return stdRemoveVM;
        }
        
        // ok
        public bool RemoveStudent(StdRemoveVM student)
        {
            // removing depending student-course if any
            appDbContext.StdsToCourses.RemoveRange(appDbContext.StdsToCourses.Where(x => x.StudentId == student.StudentId).ToList());

            // removing depending student-assignment if any
            appDbContext.StdToAsmt.RemoveRange(appDbContext.StdToAsmt.Where(x => x.StudentId == student.StudentId).ToList());
          
            // removing student
            appDbContext.Students.Remove(appDbContext.Students.Where(b => b.StudentId == student.StudentId).FirstOrDefault());

            // throw new Exception();

            appDbContext.SaveChanges();
            return true;
        }

    }
}
