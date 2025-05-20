// import React, { useEffect, useState, useContext } from "react";
// import Loader from "../loader/loader.jsx";
// import axios from "../../baseURL/axios";
// import { GlobalContext } from "../context/context.jsx";
// import { useCookies } from "react-cookie";
// import { jwtDecode } from "jwt-decode";

// const Auth = () => {
//   const [loader, setLoader] = useState(false);
//   const [cookie, removeCookie] = useCookies("token");
//   const { setAuthEmail, setAuthRole, setAuthName, setAuthId } =
//     useContext(GlobalContext);

//   useEffect(() => {
//     if (cookie.token) {
//       const decoded = jwtDecode(cookie.token);
//       setAuthName(decoded.name);
//       setAuthEmail(decoded.email);
//       setAuthRole(decoded.role);
//       setAuthId(decoded.id);
//       setLoader(false);
//       axios.post("/auth/verify-token").then((response) => {
//         if (!response.data.isValid) {
//           removeCookie("token", "");
//           window.location.reload();
//         }
//       });
//     }
//   }, [cookie.token]);
//   return <div>{loader && <Loader display={loader} />}</div>;
// };

// export default Auth;

import { useEffect, useState, useContext } from "react";
import axios from "../../baseURL/axios";
import { GlobalContext } from "../context/context.jsx";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [cookie, , removeCookie] = useCookies(["token"]);
  const { setAuthEmail, setAuthRole, setAuthName, setAuthId } =
    useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        if (cookie.token) {
          const decoded = jwtDecode(cookie.token);
          setAuthName(decoded.name);
          setAuthEmail(decoded.email);
          setAuthRole(decoded.role);
          setAuthId(decoded.id);

          const response = await axios.post(
            "/auth/verify-token",
            {},
            {
              headers: {
                Authorization: `Bearer ${cookie.token}`,
              },
            }
          );

          if (!response.data.isValid) {
            removeCookie("token");
            navigate("/sign-in");
          }
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        removeCookie("token");
        navigate("/sign-in");
      }
    };

    verify();
  }, []);
};

export default Auth;
