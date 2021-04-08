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
    }
}
