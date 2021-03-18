using Entities.Models;
using Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.EFCore.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly UniversityContext appDbContext;

        public DepartmentRepository(UniversityContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<Department> GetAllDepartments()
        {
            return appDbContext.Departments.Include(x => x.Faculties).OrderByDescending(d => d.DepartmentName).ToList();
        }

        public IEnumerable<Department> GetDepartments()
        {
            return appDbContext.Departments.ToList();
        }

        public Department AddDepartment(Department department)
        {
            var result = appDbContext.Departments.Add(department);
            appDbContext.SaveChanges();
            return result.Entity;
        }               
    
    }
}
