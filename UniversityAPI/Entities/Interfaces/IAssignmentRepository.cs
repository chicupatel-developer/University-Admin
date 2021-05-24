using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Interfaces
{
    public interface IAssignmentRepository
    {
        IEnumerable<Assignment> GetAssignments();
        Assignment AddAssignment(Assignment assignment);
        IEnumerable<FacultyListVM> GetFacultyList(int selectedDeptId);
        IEnumerable<CourseListVM> GetCourseList(int selectedFacId);
        IEnumerable<AsmtFacDeptVM> GetAsmtFacDept();
        AsmtUpload FileUpload(AsmtUpload asmtUpload);
    }
}
