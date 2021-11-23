using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{
    // Student : user
    public class StdCrsFacVM
    {
        public int StudentId { get; set; }        
        public List<StdCrsVM> MyCourses { get; set; }
    }
}
