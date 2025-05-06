import React, { useEffect, useState, useContext } from "react";
import Loader from "../loader/loader.jsx";
import axios from "../../baseURL/axios";
import { GlobalContext } from "../context/context.jsx";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

const Auth = () => {
  const [loader, setLoader] = useState(false);
  const [cookie, removeCookie] = useCookies("token");
  const { setAuthEmail, setAuthRole, setAuthName } = useContext(GlobalContext);

  useEffect(() => {
    if (cookie.token) {
      const decoded = jwtDecode(cookie.token);
      setAuthName(decoded.name);
      setAuthEmail(decoded.email);
      setAuthRole(decoded.role);
      setLoader(false);
      axios.post("/auth/verify-token").then((response) => {
        if (!response.data.isValid) {
          removeCookie("token", "");
          window.location.reload();
        }
      });
    }
  }, [cookie.token]);
  return <div>{loader && <Loader display={loader} />}</div>;
};

export default Auth;
