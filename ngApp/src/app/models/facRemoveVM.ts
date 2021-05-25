import AssignmentRemoveVM from "./AssignmentRemoveVM";
import CourseRemoveVM from "./courseRemoveVM";
import FacultyRemoveVM from "./facultyRemoveVM";

export default class FacRemoveVM {    
    errorCode: number;
    errorMessage: string;
    facultyRemove: FacultyRemoveVM;
    dependingCourses: CourseRemoveVM[];
}
