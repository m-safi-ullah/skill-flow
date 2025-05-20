import React, { useEffect, useState } from "react";
import Header from "./Pages/MainPages/Header";
import Home from "./Pages/MainPages/Home";
import About from "./Pages/MainPages/About";
import FAQ from "./Pages/MainPages/FAQ";
import Service from "./Pages/MainPages/Service";
import Footer from "./Pages/MainPages/Footer";
import { Routes, Route } from "react-router-dom";
import SignUp from "./Pages/AuthenticationPages/SignUp";
import SignIn from "./Pages/AuthenticationPages/SignIn";
import BecomeASeller from "./Pages/AuthenticationPages/BecomeASeller";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Auth from "./Pages/auth/Auth";
import ResetPassword from "./Pages/AuthenticationPages/ResetPassword";
import SellerProfile from "./Pages/Profile/SellerProfile";
import BuyerProfile from "./Pages/Profile/BuyerProfile";
import Product from "./Pages/SellerProduct/Product";
import Portfolio from "./Pages/SellerPortfolio/Portfolio";
import PageNotFound from "./Pages/MainPages/PageNotFound";
import SearchProducts from "./Pages/Search/SearchProducts";
import CometChat from "./Pages/Chat/CometChat";

export default function App() {
  return (
    <>
      <Header />
      <Auth />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/service" element={<Service />} />
        <Route path="/search" element={<SearchProducts />} />

        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/become-a-seller" element={<BecomeASeller />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/seller/:name" element={<SellerProfile />} />
        <Route path="/buyer/:name" element={<BuyerProfile />} />
        <Route path="/:username/:title" element={<Product />} />
        <Route path="/:username/portfolio/:id" element={<Portfolio />} />
        <Route path="/chat" element={<CometChat />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
