using Entities.Models;
using Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Microsoft.EntityFrameworkCore;

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
    }
}
