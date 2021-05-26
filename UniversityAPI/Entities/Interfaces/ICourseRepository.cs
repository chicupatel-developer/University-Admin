using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Interfaces
{
    public interface ICourseRepository
    {
        IEnumerable<CourseListVM> GetCourses();
        Course AddCourse(Course course);
        Course GetCourse(int crsId);
        Course EditCourse(Course course);
        CrsRemoveVM InitializeRemoveCourse(int crsId);
        bool RemoveCourse(CrsRemoveVM course);
    }
}
