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
            // return appDbContext.Faculties.ToList();
            return null;
        }

        public Course AddCourse(Course course)
        {
            var result = appDbContext.Courses.Add(course);
            appDbContext.SaveChanges();
            return result.Entity;
        }
    }
}
