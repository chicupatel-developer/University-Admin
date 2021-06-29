using Entities.Models;
using Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Entities.DTO;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.EFCore.Repositories
{
    public class AssignmentRepository : IAssignmentRepository
    {
        private readonly UniversityContext appDbContext;

        // ok
        public AssignmentRepository(UniversityContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        // ok
        public IEnumerable<Assignment> GetAssignments()
        {
            return appDbContext.Assignments.ToList();
        }

        // ok
        public Assignment AddAssignment(Assignment assignment)
        {
            var result = appDbContext.Assignments.Add(assignment);
            appDbContext.SaveChanges();
            return result.Entity;
        }

        // ok
        public IEnumerable<FacultyListVM> GetFacultyList(int selectedDeptId)
        {
            List<FacultyListVM> faculties = new List<FacultyListVM>();
            var facs = appDbContext.Faculties.Where(x => x.DepartmentId == selectedDeptId);

            if (facs != null)
            {
                foreach (var f in facs)
                {
                    FacultyListVM faculty = new FacultyListVM
                    {
                        FacultyId = f.FacultyId,
                        FacultyName = f.FirstName + ", " + f.LastName
                    };
                    faculties.Add(faculty);
                }
            }
            else
            {

            }        
            return faculties;
        }

        // ok
        public IEnumerable<CourseListVM> GetCourseList(int selectedFacId)
        {
            List<CourseListVM> courses = new List<CourseListVM>();
            var crs = appDbContext.Courses.Where(x => x.FacultyId == selectedFacId);

            if (crs != null)
            {
                foreach (var cr in crs)
                {
                    CourseListVM course = new CourseListVM
                    {
                        CourseId = cr.CouseId,
                        CourseName = cr.CouseName
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
        public IEnumerable<AsmtFacDeptVM> GetAsmtFacDept()
        {
            List<AsmtFacDeptVM> datas = new List<AsmtFacDeptVM>();

            if (appDbContext.Assignments.Count() >= 1)
            {
                foreach(var asmt in appDbContext.Assignments.Include(x=>x.Faculty).Include(y=>y.Faculty.Department).Include(xx=>xx.Course))
                {
                    AsmtFacDeptVM data = new AsmtFacDeptVM()
                    {
                        AssignmentId = asmt.AssignmentId,
                        Title = asmt.Title,
                        Details = asmt.Details,
                        FacultyId = asmt.FacultyId,
                        FacultyName = asmt.Faculty.FirstName + ", " + asmt.Faculty.LastName,
                        DepartmentId = asmt.Faculty.DepartmentId,
                        DepartmentName = asmt.Faculty.Department.DepartmentName,
                        AsmtCreateDate = asmt.AsmtCreateDate,
                        AsmtLastDate = asmt.AsmtLastDate,
                        AsmtUploadId = asmt.AsmtUploadId,
                        CourseId = asmt.CourseId,
                        CourseName = asmt.Course.CouseName
                    };
                    datas.Add(data);
                }

                // load asmt. file name
                foreach(var asmt in datas)
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

            }
            return datas;
        }

        // ok
        // Admin - Assignment upload
        public AsmtUpload FileUpload(AsmtUpload asmtUpload)
        {
            var result = appDbContext.AsmtUploads.Add(asmtUpload);
            appDbContext.SaveChanges();
            return result.Entity;
        }
    }
}
