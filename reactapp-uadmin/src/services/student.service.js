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
  initializeRemoveStudent = async (stdId) => {
    return await http.get(`/initializeRemoveStudent/${stdId}`, {
      headers: authHeader(),
    });
  };
  removeStudent = async (data) => {
    return await http.post(`/removeStudent`, data, {
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

  // Student : role
  // this will load courses and faculty info only assigned to respective student
  getMyCourses = async (stdId) => {
    return await http.get(`/getMyCourses/${stdId}`, {
      headers: authHeader(),
    });
  };
  // Student : role
  loadAsmtsForStudentCourse = async (data) => {
    return await http.post(`/loadAsmtsForStudentCourse`, data, {
      headers: authHeader(),
    });
  };
  // Student : role
  downloadAsmt = async (data) => {
    return await http.post(`/downloadAsmt`, data, {
      headers: authHeader(),
      responseType: "blob",
      // "Content-Type": "application/pdf",
    });
  };
  // Student : role
  submitAsmt = async (file, stdToAsmt, onUploadProgress) => {
    let formData = new FormData();
    formData.append("asmtFile", file, file.name);
    formData.append("stdToAsmt", stdToAsmt);
    return await http.post("/asmtSubmit", formData, {
      headers: authHeader(),
      onUploadProgress,
    });
  };
}
export default new StudentService();
