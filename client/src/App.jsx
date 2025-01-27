import React, { useEffect } from "react";
import Header from "./Pages/Header";
import Home from "./Pages/Home";
import Footer from "./Pages/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/AuthenticationPages/SignUp";
import SignIn from "./Pages/AuthenticationPages/SignIn";
import BecomeASeller from "./Pages/AuthenticationPages/BecomeASeller";
import Dashboard from "./Pages/Dashboard";
import Auth from "./Pages/auth/auth";
import { useCookies } from "react-cookie";
import useAxios from "./baseURL/axios";

export default function App() {
  const [cookies, removeCookie] = useCookies("token");
  const axios = useAxios();
  useEffect(() => {
    axios.post("/auth/verify-token").then((response) => {
      if (!response.data.isValid) {
        removeCookie("token", { path: "/" });
      }
    });
  }, [cookies.token]);
  return (
    <Router>
      <Header />
      {cookies.token && <Auth />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/become-a-seller" element={<BecomeASeller />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}
