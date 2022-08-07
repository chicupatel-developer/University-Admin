import http from "../axios/faculty-http-common";
import authHeader from "./auth.header";

class FacultyService {
  allFaculties = async () => {
    return await http.get(`/allFaculties`, {
      headers: authHeader(),
    });
  };
  createFaculty = async (data) => {
    return await http.post(`/addFaculty`, data, {
      headers: authHeader(),
    });
  };
  getFaculty = async (facId) => {
    return await http.get(`/getFaculty/${facId}`, {
      headers: authHeader(),
    });
  };
  editFaculty = async (data) => {
    return await http.post(`/editFaculty`, data, {
      headers: authHeader(),
    });
  };
  initializeRemoveFaculty = async (facId) => {
    return await http.get(`/initializeRemoveFaculty/${facId}`, {
      headers: authHeader(),
    });
  };
  removeFaculty = async (data) => {
    return await http.post(`/removeFaculty`, data, {
      headers: authHeader(),
    });
  };
}
export default new FacultyService();
