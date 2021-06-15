using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class AsmtCrsStdVM
    {
        public int AssignmentId { get; set; }
        public string Title { get; set; }
        public string Details { get; set; }
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public DateTime AsmtCreateDate { get; set; }
        public DateTime AsmtLastDate { get; set; }
        public int AsmtUploadId { get; set; }
        public string AsmtFileName { get; set; }

        // AsmtLinked, // when course and it's asmt is linked to student
        // AsmtNotLinked, // when course is linked but it's asmt is not linked to student
        // AsmtDisConnected // when course and asmt are linked and later on course is not linked(course is removed from student) to student but it's(course's) asmt is still linked to student
        public AsmtLinkStatus AsmtLinkStatus { get; set; }
    }
}
