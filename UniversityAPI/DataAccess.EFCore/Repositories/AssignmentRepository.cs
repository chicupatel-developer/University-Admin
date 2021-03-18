using Entities.Models;
using Entities.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using Entities.DTO;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.EFCore.Repositories
{
    public class AssignmentRepository : IAssignmentRepository
    {
        private readonly UniversityContext appDbContext;

        public AssignmentRepository(UniversityContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public IEnumerable<Assignment> GetAssignments()
        {
            return appDbContext.Assignments.ToList();
        }

        public Assignment AddAssignment(Assignment assignment)
        {
            var result = appDbContext.Assignments.Add(assignment);
            appDbContext.SaveChanges();
            return result.Entity;
        }

        public IEnumerable<FacultyListVM> GetFacultyList(int selectedDeptId)
        {
            List<FacultyListVM> faculties = new List<FacultyListVM>();
            var facs = appDbContext.Faculties.Where(x => x.DepartmentId == selectedDeptId);

            if (facs != null)
            {
                foreach (var f in facs)
                {
                    FacultyListVM faculty = new FacultyListVM
                    {
                        FacultyId = f.FacultyId,
                        FacultyName = f.FirstName + ", " + f.LastName
                    };
                    faculties.Add(faculty);
                }
            }
            else
            {

            }        
            return faculties;
        }

        public IEnumerable<AsmtFacDeptVM> GetAsmtFacDept()
        {
            List<AsmtFacDeptVM> datas = new List<AsmtFacDeptVM>();

            if (appDbContext.Assignments.Count() >= 1)
            {
                foreach(var asmt in appDbContext.Assignments.Include(x=>x.Faculty).Include(y=>y.Faculty.Department))
                {                  
                    AsmtFacDeptVM data = new AsmtFacDeptVM()
                    {
                        AssignmentId = asmt.AssignmentId,
                        Title = asmt.Title,
                        Details = asmt.Details,
                        FacultyId = asmt.FacultyId,
                        FacultyName = asmt.Faculty.FirstName + ", " + asmt.Faculty.LastName,
                        DepartmentId = asmt.Faculty.DepartmentId,
                        DepartmentName = asmt.Faculty.Department.DepartmentName
                    };
                    datas.Add(data);
                }
            }
            else
            {

            }
            return datas;
        }

        public AsmtUpload FileUpload(AsmtUpload asmtUpload)
        {
            var result = appDbContext.AsmtUploads.Add(asmtUpload);
            appDbContext.SaveChanges();
            return result.Entity;
        }
    }
}
