import http from "../axios/auth-http-common";

class AuthService {
  login = async (data) => {
    return await http.post(`/login`, data);
  };

  getCurrentUser = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser : null;
  };

  getCurrentUserId = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser.userId : null;
  };

  getCurrentUserFullName = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser.fullName : null;
  };

  getToken = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser.token : null;
  };

  getCurrentUserRole = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser.role : null;
  };

  getCurrentUserName = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser.userName : null;
  };

  logout = () => {
    localStorage.removeItem("currentUser");
  };

  register = async (data) => {
    return await http.post(`/register`, data);
  };
}
export default new AuthService();
