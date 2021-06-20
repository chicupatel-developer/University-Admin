using Entities.DTO;
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
        Student GetStudent(int stdId);
        Student EditStudent(Student student);
        bool EditCoursesToStudent(List<StdToCourse> stdToCourses);
        IEnumerable<CourseListVM> GetCoursesForStudent(int stdId);

        // this will load assignments of selected course to respective student 
        IEnumerable<AsmtCrsStdVM> GetAsmtsForStudentCourse(AsmtStdCrsVM asmtStdCrsVM);
        
        // during asmt(course-student) download process
        bool EditAsmtsToStudent(StdToAsmtDownload stdToAsmtDownload);

        // assignment submit
        AsmtSubmitVM AsmtSubmit(AsmtSubmitVM asmtSubmitVM);

        // Student : user
        StdCrsFacVM GetMyCourses(int stdId);

        // updating StudentUserId column value by Id column value of ApplicationUser
        void ConnectApplicationUserToStudent(string Id, int stdId);

        // returns students those are yet not linked to ApplicationUser
        // means students with StudentUserId is null
        IEnumerable<Student> GetStudentsNotLinkedToApplicationUser();
        Student GetStudentLoginProcess(string id);
    }
  
}
