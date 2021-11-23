using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class CourseEditVM
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; }

        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }

        public int CurrentFacultyId { get; set; }
        public List<FacultyListVM> FacultyList { get; set; }
    }
}
