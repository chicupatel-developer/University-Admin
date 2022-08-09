import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44354/api/Assignment",
  headers: {
    "Content-type": "application/json",
  },
});
