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
}
export default new AssignmentService();
