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

    }
}
