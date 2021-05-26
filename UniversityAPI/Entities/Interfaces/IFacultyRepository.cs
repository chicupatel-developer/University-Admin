using Entities.DTO;
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
        Faculty GetFaculty(int facId);
        Faculty EditFaculty(Faculty faculty);
        FacRemoveVM InitializeRemoveFaculty(int facId);
        bool RemoveFaculty(FacRemoveVM faculty);
    }
}
