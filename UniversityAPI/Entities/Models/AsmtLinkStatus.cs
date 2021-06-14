using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Models
{
    public enum AsmtLinkStatus
    {
        AsmtLinked, // when course and it's asmt is linked to student
        AsmtNotLinked, // when course is linked but it's asmt is not linked to student
        AsmtDisConnected // when course and asmt are linked and later on course is not linked(course is removed from student) to student but it's(course's) asmt is still linked to student
    }  
}
