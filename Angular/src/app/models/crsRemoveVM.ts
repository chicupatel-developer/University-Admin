import AssignmentRemoveVM from "./AssignmentRemoveVM";
import CourseRemoveVM from "./courseRemoveVM";
import FacultyRemoveVM from "./facultyRemoveVM";

export default class CrsRemoveVM {
    errorCode: number;
    errorMessage: string;
    courseRemove: CourseRemoveVM; 
    dependingAssignments: AssignmentRemoveVM[];
}
