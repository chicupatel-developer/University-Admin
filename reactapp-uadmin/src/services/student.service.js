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
}
export default new StudentService();
