using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Models
{
    public enum AsmtLinkStatus
    {
        AsmtLinked, // when course and it's asmt is linked to student
        AsmtNotLinked, // when course is linked but it's asmt is not linked to student
        AsmtSubmitted // when course and asmt are linked and asmt is submitted by student
        // in db table StdToAsmt, status is either 0 or 2
    }
}
