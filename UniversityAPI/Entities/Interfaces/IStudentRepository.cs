﻿using Entities.DTO;
using Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.Interfaces
{
    public interface IStudentRepository
    {
        IEnumerable<Student> GetAllStudents();
        Student AddStudent(Student student);
        bool EditCoursesToStudent(List<StdToCourse> stdToCourses);
        IEnumerable<CourseListVM> GetCoursesForStudent(int stdId);
    }
  
}
