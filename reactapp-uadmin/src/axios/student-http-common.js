import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44354/api/Student",
  headers: {
    "Content-type": "application/json",
  },
});
