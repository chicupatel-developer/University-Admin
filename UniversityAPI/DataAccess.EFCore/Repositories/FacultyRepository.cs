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

        public FacultyRepository(UniversityContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<Faculty> GetFaculties()
        {
            return appDbContext.Faculties.ToList();
        }

        public Faculty AddFaculty(Faculty faculty)
        {
            var result = appDbContext.Faculties.Add(faculty);
            appDbContext.SaveChanges();
            return result.Entity;
        }

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
                appDbContext.SaveChanges();
                return faculty;
                // return null;
            }
            else
            {
                return null;
            }
        }

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
                facRemoveVM.ErrorMessage = "Ready To Remove Department?";
                facRemoveVM.FacultyRemove.FacultyId = facId;
                facRemoveVM.FacultyRemove.Name = appDbContext.Faculties.Where(x => x.FacultyId == facId).FirstOrDefault().FirstName;
            }
            return facRemoveVM;
        }

        public bool RemoveFaculty(FacRemoveVM faculty)
        {           
            return true;
        }
    }
}
