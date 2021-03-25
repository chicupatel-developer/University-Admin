using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Interfaces
{
    public interface IFacultyRepository
    {
        IEnumerable<Faculty> GetFaculties();
        Faculty AddFaculty(Faculty faculty);
    }
}
