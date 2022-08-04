import http from "../axios/department-http-common";
import authHeader from "./auth.header";

class DepartmentService {
  allDepartments = async () => {
    return await http.get(`/allDepartments`, {
      headers: authHeader(),
    });
  };
  createDepartment = async (data) => {
    return await http.post(`/addDepartment`, data, {
      headers: authHeader(),
    });
  };
}
export default new DepartmentService();
