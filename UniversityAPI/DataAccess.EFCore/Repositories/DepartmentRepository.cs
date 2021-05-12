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
        
        public Department GetDepartment(int deptId)
        {
            var dept = appDbContext.Departments.Where(x => x.DepartmentId == deptId).FirstOrDefault();
            return dept;
        }

        public Department EditDepartment(Department department)
        {
            var result = appDbContext.Departments.Where(x => x.DepartmentId == department.DepartmentId).FirstOrDefault();
            if (result != null)
            {
                result.DepartmentName = department.DepartmentName;
                appDbContext.SaveChanges();
                return department;
                // return null;
            }
            else{
                return null;
            }            
        }

        public DeptRemoveVM RemoveDepartment(int deptId)
        {
            DeptRemoveVM deptRemoveVM = new DeptRemoveVM();
            List<FacultyRemoveVM> faculties = new List<FacultyRemoveVM>();
            List<CourseRemoveVM> courses = new List<CourseRemoveVM>();
            deptRemoveVM.DependingFaculties = faculties;
            deptRemoveVM.DependingCourses = courses;

            // check for faculty dependancy
            var facs = appDbContext.Faculties.Where(x => x.DepartmentId == deptId);
            if (facs != null)
            {
                // faculty found
                // send warning to user @ department remove action
                foreach(var fac in facs)
                {
                    faculties.Add(new FacultyRemoveVM 
                        {   FacultyId = fac.FacultyId, 
                            Name = fac.FirstName + ", " + fac.LastName 
                        });
                }
            }
            else
            {
            }

            // check for course dependancy
            var crs = appDbContext.Courses.Where(x => x.DepartmentId == deptId);
            if (crs != null)
            {
                // course found
                // send warning to user @ department remove action
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

            if ((deptRemoveVM.DependingFaculties.Count() >= 1) || (deptRemoveVM.DependingCourses.Count() >= 1) )
            {
                deptRemoveVM.ErrorCode = -1;
                deptRemoveVM.ErrorMessage = "Database Dependancy Found. Force Remove Action?";
                deptRemoveVM.DepartmentId = deptId;
                deptRemoveVM.DepartmentName = appDbContext.Departments.Where(x => x.DepartmentId == deptId).FirstOrDefault().DepartmentName;
            }
            else
            {
                deptRemoveVM.ErrorCode = 0;
                deptRemoveVM.ErrorMessage = "Ready To Remove Department?";
                deptRemoveVM.DepartmentId = deptId;
                deptRemoveVM.DepartmentName = appDbContext.Departments.Where(x => x.DepartmentId == deptId).FirstOrDefault().DepartmentName;
            }
            return deptRemoveVM;
        }
    }
}
