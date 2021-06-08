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
        
        public bool AddCoursesToStudent(List<StdToCourse> stdToCourses)
        {
            try
            {
                if (stdToCourses.Count() >= 1)
                {
                    foreach (var stdToCourse in stdToCourses)
                    {
                        appDbContext.StdsToCourses.Add(stdToCourse);
                    }
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

    }
}
