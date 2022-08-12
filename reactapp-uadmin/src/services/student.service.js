import http from "../axios/student-http-common";
import authHeader from "./auth.header";

class StudentService {
  allStudentsNotLinkedToApplicationUser = async () => {
    return await http.get(
      `/allStudentsNotLinkedToApplicationUser`
      /* {
      headers: authHeader(),
    } */
    );
  };

  allStudents = async () => {
    return await http.get(`/allStudents`, {
      headers: authHeader(),
    });
  };
  createStudent = async (data) => {
    return await http.post(`/addStudent`, data, {
      headers: authHeader(),
    });
  };
  getStudent = async (stdId) => {
    return await http.get(`/getStudent/${stdId}`, {
      headers: authHeader(),
    });
  };
  editStudent = async (data) => {
    return await http.post(`/editStudent`, data, {
      headers: authHeader(),
    });
  };
  editCourseToStd = async (data) => {
    return await http.post(`/editCourseToStd`, data, {
      headers: authHeader(),
    });
  };
  loadCoursesForStudent = async (stdId) => {
    return await http.get(`/loadCoursesForStudent/${stdId}`, {
      headers: authHeader(),
    });
  };
}
export default new StudentService();
