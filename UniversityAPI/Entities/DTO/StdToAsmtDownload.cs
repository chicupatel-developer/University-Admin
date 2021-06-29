using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    public class StdToAsmtDownload
    {
        public int StudentId { get; set; }

        public string AsmtFileName { get; set; }
        public int AssignmentId { get; set; }

    }
}
