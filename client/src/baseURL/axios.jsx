import axios from "axios";

// Configure axios globally
axios.defaults.baseURL = "https://skill-flow-backend-dhsq.onrender.com";
// axios.defaults.baseURL = "http://localhost:4400";
axios.defaults.timeout = 10000;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

export default axios;
