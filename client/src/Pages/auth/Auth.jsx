import { useEffect, useContext } from "react";
import axios from "../../baseURL/axios";
import { GlobalContext } from "../context/context.jsx";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { setAuthEmail, setAuthRole, setAuthName, setAuthId, setRestricted } =
    useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.post(
          "/auth/verify-token",
          {},
          { withCredentials: true }
        );
        if (response.data.isValid) {
          const { name, email, role, id, restricted } = response.data.user;
          localStorage.setItem("authentication", "true");
          setAuthName(name);
          setAuthEmail(email);
          setAuthRole(role);
          setAuthId(id);
          setRestricted(restricted || false);
        } else {
          localStorage.setItem("authentication", "false");
          navigate("/sign-in");
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        localStorage.setItem("authentication", "false");
      }
    };

    verify();
  }, []);
};

export default Auth;
