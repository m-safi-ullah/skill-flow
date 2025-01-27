import { useCookies } from "react-cookie";
import axios from "axios";

const useAxios = () => {
  const [cookies] = useCookies(["token"]);

  const api = axios.create({
    baseURL: "http://localhost:4400",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      token: cookies.token || "",
    },
    withCredentials: true,
  });

  return api;
};

export default useAxios;
