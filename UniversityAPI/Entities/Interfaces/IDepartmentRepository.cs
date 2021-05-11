using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Interfaces
{
    public interface IDepartmentRepository
    {
        IEnumerable<Department> GetAllDepartments();
        IEnumerable<Department> GetDepartments();
        Department AddDepartment(Department department);
        Department GetDepartment(int deptId);
        Department EditDepartment(Department department);
    }
  
}
