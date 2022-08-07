import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44354/api/Faculty",
  headers: {
    "Content-type": "application/json",
  },
});
