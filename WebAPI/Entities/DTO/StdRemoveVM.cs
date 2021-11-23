using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class StdRemoveVM
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; }

        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }

        public List<StdCrsRemoveVM> Courses { get; set; }

        public List<StdAsmtRemoveVM> Assignments { get; set; }
    }
}
