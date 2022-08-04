import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44354/api/Department",
  headers: {
    "Content-type": "application/json",
  },
});
