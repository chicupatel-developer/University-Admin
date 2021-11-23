using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    // Student : user
    public class StdCrsVM
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public int FacultyId { get; set; }
        public string FacultyName { get; set; }
    }
}
