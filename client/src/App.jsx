import React, { useEffect, useState } from "react";
import Header from "./Pages/Header";
import Home from "./Pages/Home";
import Footer from "./Pages/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/AuthenticationPages/SignUp";
import SignIn from "./Pages/AuthenticationPages/SignIn";
import BecomeASeller from "./Pages/AuthenticationPages/BecomeASeller";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Auth from "./Pages/auth/Auth";
import ResetPassword from "./Pages/AuthenticationPages/ResetPassword";
import Loader from "./Pages/loader/loader";

export default function App() {
  return (
    <Router>
      <Loader />
      <Header />
      <Auth />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/become-a-seller" element={<BecomeASeller />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </Router>
  );
}
