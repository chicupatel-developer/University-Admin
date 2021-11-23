using System;
using System.Collections.Generic;
using System.Text;

namespace Entities.DTO
{

    // this file contains all necessary types to remove 
    // department, faculty, course, assignment 


    // faculty depends on department
    // course depends on faculty
    // while removing department, check for faculty, assignment and course dependancy
    // while removing faculty, check for assignment and course dependancy
    // while removing course, check for assignment dependancy


    // main type for course remove
    public class CrsRemoveVM
    {
        public int ErrorCode { get; set; } //1        
        public string ErrorMessage { get; set; } //1        
        public CourseRemoveVM CourseRemove { get; set; } //1        
        public List<AssignmentRemoveVM> DependingAssignments { get; set; } //*
    }

    // main type for faculty remove
    public class FacRemoveVM
    {
        public FacultyRemoveVM FacultyRemove { get; set; }
        public List<CourseRemoveVM> DependingCourses { get; set; }
        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
    }

    // main type for department remove
    public class DeptRemoveVM
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public int ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
        public List<FacultyRemoveVM> DependingFaculties { get; set; }
        public List<CourseRemoveVM> DependingCourses { get; set; }

    }
    public class FacultyRemoveVM
    {
        public int FacultyId { get; set; }
        public string Name { get; set; }
        public List<AssignmentRemoveVM> DependingAssignments { get; set; }
    }
    public class CourseRemoveVM
    {
        public int CourseId { get; set; }
        public string Name { get; set; }
    }
    public class AssignmentRemoveVM
    {
        public int AssignmentId { get; set; }
        public int AsmtUploadId { get; set; }
        public string Title { get; set; }
    }
}
