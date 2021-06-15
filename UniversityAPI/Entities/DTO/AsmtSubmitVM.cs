using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class AsmtSubmitVM
    {
        public int StudentId { get; set; }
        public int AssignmentId { get; set; }

        public string AsmtSubmitFilePath { get; set; }
        public string AsmtSubmitFileName { get; set; }
        public DateTime AsmtSubmitDate { get; set; }
        public AsmtLinkStatus AsmtLinkStatus { get; set; }
    }
}
