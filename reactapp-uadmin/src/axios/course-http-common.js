import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44354/api/Course",
  headers: {
    "Content-type": "application/json",
  },
});
