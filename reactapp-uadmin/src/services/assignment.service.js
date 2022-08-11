import http from "../axios/assignment-http-common";
import authHeader from "./auth.header";

class AssignmentService {
  listOfFaculties = async (deptId) => {
    return await http.get(`/listOfFaculties/${deptId}`, {
      headers: authHeader(),
    });
  };

  // display all assignments
  allAsmtFacDept = async () => {
    return await http.get(`/allAsmtFacDept`, {
      headers: authHeader(),
    });
  };

  asmtDownload = async (fileName) => {
    return await http.get(`/asmtDownload/${fileName}`, {
      headers: authHeader(),
      responseType: "blob",
      // "Content-Type": "application/pdf",
    });
  };

  listOfFaculties = async (selectedDeptId) => {
    return await http.get(`/listOfFaculties/${selectedDeptId}`, {
      headers: authHeader(),
    });
  };

  listOfCourses = async (selectedFacId) => {
    return await http.get(`/listOfCourses/${selectedFacId}`, {
      headers: authHeader(),
    });
  };
}
export default new AssignmentService();