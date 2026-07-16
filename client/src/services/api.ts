import axios from "axios";

const API = axios.create({
  baseURL: "https://hospital-management-system-1-57ky.onrender.com",
});

export default API;