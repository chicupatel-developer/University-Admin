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
    public class CourseRepository : ICourseRepository
    {
        private readonly UniversityContext appDbContext;

        public CourseRepository(UniversityContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<CourseListVM> GetCourses()
        {
            List<CourseListVM> courses = new List<CourseListVM>();

            var cs = appDbContext.Courses.Include(x => x.Department);
            if (cs != null)
            {
                foreach(var c in cs)
                {
                    var fs = appDbContext.Faculties.Where(y => y.FacultyId == c.FacultyId).FirstOrDefault();
                    if (fs != null)
                    {
                        CourseListVM course = new CourseListVM()
                        {
                             FacultyId = fs.FacultyId,
                             FacultyName = fs.FirstName+", "+fs.LastName,
                             CourseId = c.CouseId,
                             CourseName = c.CouseName,
                             DepartmentId = c.Department.DepartmentId,
                             DepartmentName = c.Department.DepartmentName
                        };
                        courses.Add(course);
                    }
                    else
                    {

                    }
                }
            }
            else
            {

            }            
            return courses;
        }

        public Course AddCourse(Course course)
        {
            var result = appDbContext.Courses.Add(course);
            appDbContext.SaveChanges();
            return result.Entity;
        }

        // ok      
        public CourseEditVM GetCourse(int crsId)
        {
            CourseEditVM course = new CourseEditVM();
            List<FacultyListVM> facultyList = new List<FacultyListVM>();
            course.FacultyList = facultyList;

            var crs = appDbContext.Courses.Where(x => x.CouseId == crsId).Include(x=>x.Department).FirstOrDefault();
            course.CourseId = crs.CouseId;
            course.CourseName = crs.CouseName;
            course.CurrentFacultyId = crs.FacultyId;
            course.DepartmentId = crs.DepartmentId;
            course.DepartmentName = crs.Department.DepartmentName;

            var facs = appDbContext.Faculties.Where(y => y.DepartmentId == crs.DepartmentId);
            if (facs != null)
            {
                foreach(var fac in facs)
                {
                    facultyList.Add(new FacultyListVM
                    {
                        FacultyId = fac.FacultyId,
                        FacultyName = fac.FirstName + ", " + fac.LastName
                    });
                }
            }
            else
            {

            }
            return course;
        }

        // ok            
        /*
            ui can change facultyId for a particular courseId @Course db table
            so run code @Assignment db table to change facultyId column value for
            a respective courseId
            set FacultyId = new value
            where CourseId = courseId of currently changed course's courseId
            ui can change faculty value only belong to same department where 
            currently course is having department value
        */
        public Course EditCourse(Course course)
        {
            var result = appDbContext.Courses.Where(x => x.CouseId == course.CouseId).FirstOrDefault();
            if (result != null)
            {
                result.CouseName = course.CouseName;
                result.FacultyId = course.FacultyId;

                var asmts = appDbContext.Assignments.Where(y => y.CourseId == course.CouseId);
                if (asmts != null)
                {
                    foreach(var asmt in asmts)
                    {
                        asmt.FacultyId = result.FacultyId;
                    }
                }
                else
                {
                }
                appDbContext.SaveChanges();
                return course;
            }
            else
            {
                return null;
            }
        }

        // ok
        public CrsRemoveVM InitializeRemoveCourse(int crsId)
        {
            CrsRemoveVM crsRemoveVM = new CrsRemoveVM();
            CourseRemoveVM course = new CourseRemoveVM();
            List<AssignmentRemoveVM> dependingAssignments = new List<AssignmentRemoveVM>();

            crsRemoveVM.CourseRemove = course;
            crsRemoveVM.DependingAssignments = dependingAssignments;

            // check for assignment dependancy
            var asmts = appDbContext.Assignments.Where(y => y.CourseId == crsId);
            if (asmts != null)
            {
                List<AssignmentRemoveVM> assignments = new List<AssignmentRemoveVM>();
                // assignment found
                // send warning to user @ course remove action
                foreach (var asmt in asmts)
                {
                    assignments.Add(new AssignmentRemoveVM
                    {
                        AssignmentId = asmt.AssignmentId,
                        AsmtUploadId = asmt.AsmtUploadId,
                        Title = asmt.Title
                    });
                }
                crsRemoveVM.DependingAssignments = assignments;
            }
            else
            {
            }        

            if (crsRemoveVM.DependingAssignments.Count() >= 1)
            {
                crsRemoveVM.ErrorCode = -1;
                crsRemoveVM.ErrorMessage = "Database Dependancy Found. Force Remove Action?";
                crsRemoveVM.CourseRemove.CourseId = crsId;
                crsRemoveVM.CourseRemove.Name = appDbContext.Courses.Where(x => x.CouseId == crsId).FirstOrDefault().CouseName;
            }
            else
            {
                crsRemoveVM.ErrorCode = 0;
                crsRemoveVM.ErrorMessage = "Ready To Remove Course?";
                crsRemoveVM.CourseRemove.CourseId = crsId;
                crsRemoveVM.CourseRemove.Name = appDbContext.Courses.Where(x => x.CouseId == crsId).FirstOrDefault().CouseName;
            }
            return crsRemoveVM;
        }

        // ok
        public bool RemoveCourse(CrsRemoveVM course)
        {           
            // removing depending assignment if any 
            appDbContext.Assignments.RemoveRange(appDbContext.Assignments.Where(y => y.CourseId == course.CourseRemove.CourseId).ToList());

            // throw new Exception();

            // course remove
            appDbContext.Courses.RemoveRange(appDbContext.Courses.Where(yy => yy.CouseId == course.CourseRemove.CourseId).ToList());

            appDbContext.SaveChanges();
            return true;
        }
    }
}
