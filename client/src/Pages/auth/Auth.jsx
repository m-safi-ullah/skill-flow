import { useContext, useEffect } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { GlobalContext } from "../context/context.jsx";

const useAuth = () => {
  const { setAuthEmail, setAuthRole, setAuthName } = useContext(GlobalContext);
  const [cookies] = useCookies(["token"]);
  const transformedCookies = cookies.token;

  useEffect(() => {
    if (transformedCookies) {
      try {
        const decoded = jwtDecode(transformedCookies);
        setAuthName(decoded.name);
        setAuthEmail(decoded.email);
        setAuthRole(decoded.role);
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    }
  }, [transformedCookies, setAuthEmail, setAuthRole]);

  return;
};

export default useAuth;
