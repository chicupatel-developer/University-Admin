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
  getDepartment = async (deptId) => {
    return await http.get(`/getDepartment/${deptId}`, {
      headers: authHeader(),
    });
  };
  editDepartment = async (data) => {
    return await http.post(`/editDepartment`, data, {
      headers: authHeader(),
    });
  };
  initializeRemoveDepartment = async (deptId) => {
    return await http.get(`/initializeRemoveDepartment/${deptId}`, {
      headers: authHeader(),
    });
  };
}
export default new DepartmentService();
