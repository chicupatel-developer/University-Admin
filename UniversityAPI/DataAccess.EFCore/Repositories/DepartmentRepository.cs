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

        public DeptRemoveVM InitializeRemoveDepartment(int deptId)
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
                    // check for assignment dependancy
                    var asmts = appDbContext.Assignments.Where(y => y.FacultyId == fac.FacultyId);
                    if (asmts != null)
                    {
                        List<AssignmentRemoveVM> assignments = new List<AssignmentRemoveVM>();
                        // assignment found
                        // send warning to user @ department remove action
                        foreach (var asmt in asmts)
                        {
                            assignments.Add(new AssignmentRemoveVM
                            {
                                AssignmentId = asmt.AssignmentId,
                                AsmtUploadId = asmt.AsmtUploadId,
                                Title = asmt.Title
                            });
                        }
                        faculties.Add(new FacultyRemoveVM
                        {
                            FacultyId = fac.FacultyId,
                            Name = fac.FirstName + ", " + fac.LastName,
                            DependingAssignments = assignments
                        });
                    }
                    else
                    {
                        faculties.Add(new FacultyRemoveVM
                        {
                            FacultyId = fac.FacultyId,
                            Name = fac.FirstName + ", " + fac.LastName
                        });
                    }                  
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

        public bool RemoveDepartment(DeptRemoveVM department)
        {
            // removing depending course if any
            appDbContext.Courses.RemoveRange(appDbContext.Courses.Where(x => x.DepartmentId == department.DepartmentId).ToList());

            // removing depending assignment if any belong to depending faculty
            var facultiesToRemove = appDbContext.Faculties.Where(x => x.DepartmentId == department.DepartmentId);
            if (facultiesToRemove != null)
            {
                // check for depending assignment on faculty, if any then remove assignment first then faculty
                // assignment remove
                foreach(var fac in facultiesToRemove)
                {
                    var asmtsToRemove = appDbContext.Assignments.Where(y => y.FacultyId == fac.FacultyId);
                    if (asmtsToRemove != null)
                    {
                        // remove depending assignments
                        appDbContext.Assignments.RemoveRange(asmtsToRemove);
                    }
                    else
                    {
                    }
                }
                // faculty remove
                appDbContext.Faculties.RemoveRange(facultiesToRemove);
            }
            else
            {
                // no need to remove either assignment or faculty
            }


            // removing department
            appDbContext.Departments.Remove(appDbContext.Departments.Where(b => b.DepartmentId == department.DepartmentId).FirstOrDefault());

            // throw new Exception();

            appDbContext.SaveChanges();
            return true;
        }
    }
}
