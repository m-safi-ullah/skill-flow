import React, { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { GlobalContext } from "../context/context.jsx";
import Admin from "./Admin.jsx";
import Buyer from "./Buyer.jsx";
import { Link, useLocation } from "react-router-dom";
import DashboardTab from "./Tabs/DashboardTab.jsx";
import ProfileTab from "./Tabs/ProfileTab.jsx";
import Seller from "./Seller.jsx";
import SettingTab from "./Tabs/SettingTab.jsx";

const Dashboard = () => {
  const [cookies] = useCookies(["token"]);
  const { authRole } = useContext(GlobalContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarHeight, setSidebarHeight] = useState("calc(100vh - 4rem)");

  const location = useLocation();

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 64) {
        // Adjust based on header height
        setSidebarHeight("100vh"); // Full height when header disappears
      } else {
        setSidebarHeight("calc(100vh - 4rem)");
      }
    };
    const tabName = location.search.split("=");
    if (tabName[1]) {
      setActiveSection(tabName[1]);
    } else {
      window.location.href = "/dashboard?tab=dashboard";
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);
  useEffect(() => {
    if (!cookies.token) {
      window.location.href = "/sign-in";
    }
  }, [cookies.token]);
  return (
    <div>
      <div className=" dashboard ">
        <div className="flex">
          <nav
            className="w-1/5 shadow-lg p-5 sticky overflow-y-auto top-0 left-0"
            style={{ height: sidebarHeight }}
          >
            {" "}
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard?tab=dashboard">
                  <button
                    className={`w-full text-left py-3 px-3 rounded-lg flex group items-center transition-colors duration-200 ${
                      activeSection === "dashboard" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("dashboard")}
                  >
                    <svg
                      className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <circle cx="12" cy="13" r="2" />{" "}
                      <line x1="13.45" y1="11.55" x2="15.5" y2="9.5" />{" "}
                      <path d="M6.4 20a9 9 0 1 1 11.2 0Z" />
                    </svg>
                    <span className="hidden sm:block">Dashboard</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=profile">
                  <button
                    className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                      activeSection === "profile" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("profile")}
                  >
                    <svg
                      className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />{" "}
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="hidden sm:block">Profile</span>
                  </button>
                </Link>
              </li>
              {authRole === "admin" && (
                <>
                  <li>
                    <Link to="/dashboard?tab=add-new-admin">
                      <button
                        className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                          activeSection === "add-new-admin" ? "active" : ""
                        }`}
                        onClick={() => handleSectionChange("add-new-admin")}
                      >
                        <svg
                          className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <circle cx="9" cy="7" r="4" />{" "}
                          <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />{" "}
                          <path d="M16 11h6m-3 -3v6" />
                        </svg>
                        <span className="hidden sm:block">Add New Admin</span>
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard?tab=admin-list">
                      <button
                        className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                          activeSection === "admin-list" ? "active" : ""
                        }`}
                        onClick={() => handleSectionChange("admin-list")}
                      >
                        <svg
                          className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <circle cx="9" cy="7" r="4" />{" "}
                          <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />{" "}
                          <path d="M16 11h6m-3 -3v6" />
                        </svg>
                        <span className="hidden sm:block">Admin List</span>
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard?tab=seller-list">
                      <button
                        className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                          activeSection === "seller-list" ? "active" : ""
                        }`}
                        onClick={() => handleSectionChange("seller-list")}
                      >
                        <svg
                          className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <path d="M9 5H7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2V7a2 2 0 0 0 -2 -2h-2" />{" "}
                          <rect x="9" y="3" width="6" height="4" rx="2" />{" "}
                          <line x1="9" y1="12" x2="9.01" y2="12" />{" "}
                          <line x1="13" y1="12" x2="15" y2="12" />{" "}
                          <line x1="9" y1="16" x2="9.01" y2="16" />{" "}
                          <line x1="13" y1="16" x2="15" y2="16" />
                        </svg>
                        <span className="hidden sm:block">Sellers List</span>
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard?tab=buyer-list">
                      <button
                        className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                          activeSection === "buyer-list" ? "active" : ""
                        }`}
                        onClick={() => handleSectionChange("buyer-list")}
                      >
                        <svg
                          className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <rect x="4" y="4" width="16" height="6" rx="2" />{" "}
                          <rect x="4" y="14" width="16" height="6" rx="2" />
                        </svg>
                        <span className="hidden sm:block">Buyers List</span>
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard?tab=restricted-sellers">
                      <button
                        className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                          activeSection === "restricted-sellers" ? "active" : ""
                        }`}
                        onClick={() =>
                          handleSectionChange("restricted-sellers")
                        }
                      >
                        <svg
                          className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
                          <circle cx="8.5" cy="7" r="4" />{" "}
                          <line x1="18" y1="8" x2="23" y2="13" />{" "}
                          <line x1="23" y1="8" x2="18" y2="13" />
                        </svg>
                        <span className="hidden sm:block">
                          {" "}
                          Restricted Sellers
                        </span>
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard?tab=restricted-buyers">
                      <button
                        className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                          activeSection === "restricted-buyers" ? "active" : ""
                        }`}
                        onClick={() => handleSectionChange("restricted-buyers")}
                      >
                        <svg
                          className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {" "}
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />{" "}
                          <circle cx="8.5" cy="7" r="4" />{" "}
                          <line x1="18" y1="8" x2="23" y2="13" />{" "}
                          <line x1="23" y1="8" x2="18" y2="13" />
                        </svg>
                        <span className="hidden sm:block">
                          Restricted Buyers
                        </span>
                      </button>
                    </Link>
                  </li>{" "}
                </>
              )}
              {authRole === "seller" && (
                <>
                  <li>
                    <Link to="/dashboard?tab=create-product">
                      <button
                        className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                          activeSection === "create-product" ? "active" : ""
                        }`}
                        onClick={() => handleSectionChange("create-product")}
                      >
                        <svg
                          className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          {" "}
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <rect x="4" y="4" width="16" height="6" rx="2" />{" "}
                          <rect x="4" y="14" width="16" height="6" rx="2" />
                        </svg>
                        <span className="hidden sm:block">Create Product</span>
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard?tab=product-list">
                      <button
                        className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                          activeSection === "product-list" ? "active" : ""
                        }`}
                        onClick={() => handleSectionChange("product-list")}
                      >
                        <svg
                          className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />{" "}
                          <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />{" "}
                          <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />{" "}
                          <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />{" "}
                          <line x1="11" y1="6" x2="20" y2="6" />{" "}
                          <line x1="11" y1="12" x2="20" y2="12" />{" "}
                          <line x1="11" y1="18" x2="20" y2="18" />
                        </svg>
                        <span className="hidden sm:block">Product List</span>
                      </button>
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/dashboard?tab=settings">
                  <button
                    className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                      activeSection === "settings" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("settings")}
                  >
                    <svg
                      className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />{" "}
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="hidden sm:block">Settings</span>
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
          <main className="w-4/5 p-5">
            {activeSection === "dashboard" && <DashboardTab />}
            {activeSection === "profile" && <ProfileTab />}
            {activeSection === "settings" && <SettingTab />}
            {authRole === "admin" && <Admin activeSection={activeSection} />}
            {authRole === "buyer" && <Buyer activeSection={activeSection} />}
            {authRole === "seller" && <Seller activeSection={activeSection} />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
