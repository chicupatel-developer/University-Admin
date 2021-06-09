using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class CourseListVM
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public int FacultyId { get; set; }
        public string FacultyName { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }

        // change
        public bool Checked { get; set; }

    }
}
