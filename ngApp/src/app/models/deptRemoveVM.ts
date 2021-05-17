import AssignmentRemoveVM from "./AssignmentRemoveVM";
import CourseRemoveVM from "./courseRemoveVM";
import FacultyRemoveVM from "./facultyRemoveVM";

export default class DeptRemoveVM {
    departmentId: number;
    departmentName: string;
    errorCode: number;
    errorMessage: string;
    dependingFaculties: FacultyRemoveVM[];
    dependingCourses: CourseRemoveVM[];    
}
