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

        //0 - AsmtLinked, // when course and it's asmt is linked to student
        //1 -  AsmtNotLinked, // when course is linked but it's asmt is not linked to student     
        //2 -  AsmtSubmitted // when course and asmt are linked and asmt is submitted by student
        // in db table StdToAsmt, status is either 0 or 2
        public AsmtLinkStatus AsmtLinkStatus { get; set; }
    }
}
