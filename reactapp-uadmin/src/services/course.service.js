import http from "../axios/course-http-common";
import authHeader from "./auth.header";

class CourseService {
  allCourses = async () => {
    return await http.get(`/allCourses`, {
      headers: authHeader(),
    });
  };
  createCourse = async (data) => {
    return await http.post(`/addCourse`, data, {
      headers: authHeader(),
    });
  };
  getCourse = async (courseId) => {
    return await http.get(`/getCourse/${courseId}`, {
      headers: authHeader(),
    });
  };
  editCourse = async (data) => {
    return await http.post(`/editCourse`, data, {
      headers: authHeader(),
    });
  };
  initializeRemoveCourse = async (courseId) => {
    return await http.get(`/initializeRemoveCourse/${courseId}`, {
      headers: authHeader(),
    });
  };
  removeCourse = async (data) => {
    return await http.post(`/removeCourse`, data, {
      headers: authHeader(),
    });
  };
}
export default new CourseService();
