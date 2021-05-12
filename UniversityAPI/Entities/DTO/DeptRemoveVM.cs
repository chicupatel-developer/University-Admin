using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    // faculty depends on department
    // course depends on faculty
    // while removing department, check for faculty and course dependancy
    public class DeptRemoveVM
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public List<FacultyRemoveVM> DependingFaculties { get; set; }
        public List<CourseRemoveVM> DependingCourses { get; set; }

    }
    public class FacultyRemoveVM
    {
        public int FacultyId { get; set; }
        public string Name { get; set; }
    }
    public class CourseRemoveVM
    {
        public int CourseId { get; set; }
        public string Name { get; set; }
    }
}
