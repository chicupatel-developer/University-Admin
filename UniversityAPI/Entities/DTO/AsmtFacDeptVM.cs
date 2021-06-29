using Entities.Models;
using System;

using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class AsmtFacDeptVM
    {
        public int AssignmentId { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }

        public int FacultyId { get; set; }
        public string FacultyName { get; set; }

        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }

        public int CourseId { get; set; }
        public string CourseName { get; set; }

        public DateTime AsmtCreateDate { get; set; }
        public DateTime AsmtLastDate { get; set; }

        public int AsmtUploadId { get; set; }
        public string AsmtFileName { get; set; }
    }
}
