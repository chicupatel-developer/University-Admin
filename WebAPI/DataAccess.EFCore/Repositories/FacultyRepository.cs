using Entities.Models;
using Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Entities.DTO;

namespace DataAccess.EFCore.Repositories
{
    public class FacultyRepository : IFacultyRepository
    {
        private readonly UniversityContext appDbContext;

        // ok
        public FacultyRepository(UniversityContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        // ok
        public IEnumerable<Faculty> GetFaculties()
        {
            return appDbContext.Faculties.ToList();
        }

        // ok
        public Faculty AddFaculty(Faculty faculty)
        {
            var result = appDbContext.Faculties.Add(faculty);
            appDbContext.SaveChanges();
            return result.Entity;
        }

        // ok
        public Faculty GetFaculty(int facId)
        {
            var fac = appDbContext.Faculties.Where(x => x.FacultyId == facId).FirstOrDefault();
            return fac;
        }

        // ok
        /* 
        ui can change departmentId for a particular facultyId @Faculty db table
        so run code @Course db table to change departmentId column value for
        a respective facultyId
        set DepartmentId = new value
        where FacultyId = facultyId of currently changed faculty's facultyId
        */
        public Faculty EditFaculty(Faculty faculty)
        {
            var result = appDbContext.Faculties.Where(x => x.FacultyId == faculty.FacultyId).FirstOrDefault();
            if (result != null)
            {
                result.FirstName = faculty.FirstName;
                result.LastName = faculty.LastName;
                result.Gender = faculty.Gender;
                result.PhoneNumber = faculty.PhoneNumber;
                result.Email = faculty.Email;
                result.DepartmentId = faculty.DepartmentId;

                var crsResult = appDbContext.Courses.Where(y => y.FacultyId == faculty.FacultyId);
                if (crsResult != null)
                {
                    foreach(var cr in crsResult)
                    {
                        cr.DepartmentId = faculty.DepartmentId;
                    }
                }
                else
                {

                }

                appDbContext.SaveChanges();
                return faculty;
                // return null;
            }
            else
            {
                return null;
            }
        }

        // ok
        public FacRemoveVM InitializeRemoveFaculty(int facId)
        {
            FacRemoveVM facRemoveVM = new FacRemoveVM();
            FacultyRemoveVM faculty = new FacultyRemoveVM();
            List<CourseRemoveVM> courses = new List<CourseRemoveVM>();            

            facRemoveVM.FacultyRemove = faculty;
            facRemoveVM.DependingCourses = courses;
       
            // check for assignment dependancy
            var asmts = appDbContext.Assignments.Where(y => y.FacultyId == facId);
            if (asmts != null)
            {
                List<AssignmentRemoveVM> assignments = new List<AssignmentRemoveVM>();
                // assignment found
                // send warning to user @ faculty remove action
                foreach (var asmt in asmts)
                {
                    assignments.Add(new AssignmentRemoveVM
                    {
                        AssignmentId = asmt.AssignmentId,
                        AsmtUploadId = asmt.AsmtUploadId,
                        Title = asmt.Title
                    });
                }
                facRemoveVM.FacultyRemove.DependingAssignments = assignments;
            }
            else
            {
            }

            // check for course dependancy
            var crs = appDbContext.Courses.Where(x => x.FacultyId == facId);
            if (crs != null)
            {
                // course found
                // send warning to user @ faculty remove action
                foreach (var cr in crs)
                {
                    courses.Add(new CourseRemoveVM
                    {
                        CourseId = cr.CouseId,
                        Name = cr.CouseName
                    });
                }
            }
            else
            {
            }

            if ((facRemoveVM.FacultyRemove.DependingAssignments.Count() >= 1) || (facRemoveVM.DependingCourses.Count() >= 1))
            {
                facRemoveVM.ErrorCode = -1;
                facRemoveVM.ErrorMessage = "Database Dependancy Found. Force Remove Action?";
                facRemoveVM.FacultyRemove.FacultyId = facId;
                facRemoveVM.FacultyRemove.Name = appDbContext.Faculties.Where(x => x.FacultyId == facId).FirstOrDefault().FirstName;
            }
            else
            {
                facRemoveVM.ErrorCode = 0;
                facRemoveVM.ErrorMessage = "Ready To Remove Faculty?";
                facRemoveVM.FacultyRemove.FacultyId = facId;
                facRemoveVM.FacultyRemove.Name = appDbContext.Faculties.Where(x => x.FacultyId == facId).FirstOrDefault().FirstName;
            }
            return facRemoveVM;
        }

        // ok
        public bool RemoveFaculty(FacRemoveVM faculty)
        {
            // removing depending course if any
            appDbContext.Courses.RemoveRange(appDbContext.Courses.Where(x => x.FacultyId == faculty.FacultyRemove.FacultyId).ToList());

            // removing depending assignment if any 
            appDbContext.Assignments.RemoveRange(appDbContext.Assignments.Where(y => y.FacultyId == faculty.FacultyRemove.FacultyId).ToList());

            // throw new Exception();

            // faculty remove
            appDbContext.Faculties.RemoveRange(appDbContext.Faculties.Where(yy => yy.FacultyId == faculty.FacultyRemove.FacultyId).ToList());
                        
            appDbContext.SaveChanges();
            return true;         
        }
    }
}
