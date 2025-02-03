import React, { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import Seller from "./Seller";
import { GlobalContext } from "../context/context.jsx";
import Admin from "./Admin.jsx";
import Buyer from "./Buyer.jsx";
import { Link, useLocation } from "react-router-dom";
import DashboardTab from "./Tabs/DashboardTab.jsx";
import ProfileTab from "./Tabs/ProfileTab.jsx";

const Dashboard = () => {
  const [cookies] = useCookies(["token"]);
  const { authRole } = useContext(GlobalContext);
  const [activeSection, setActiveSection] = useState("dashboard");

  const location = useLocation();

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  useEffect(() => {
    const tabName = location.search.split("=");
    if (tabName[1]) {
      setActiveSection(tabName[1]);
    } else {
      window.location.href = "/dashboard?tab=dashboard";
    }
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
          <nav className="w-1/5 shadow-lg p-5 h-screen sticky overflow-y-auto top-0 left-0">
            <ul className="space-y-4">
              <li>
                <Link to="/dashboard?tab=dashboard">
                  <button
                    className={`w-full text-left py-3 px-3 rounded-lg flex group items-center p-2 transition-colors duration-200 ${
                      activeSection === "dashboard" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("dashboard")}
                  >
                    <svg
                      className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                    <span className="hidden sm:block">Dashboard</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=profile">
                  <button
                    className={`w-full text-left py-3 px-3 flex group items-center p-2 rounded-lg transition-colors duration-200 ${
                      activeSection === "profile" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("profile")}
                  >
                    <svg
                      className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                    </svg>
                    <span className="hidden sm:block">Profile</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=seller-list">
                  <button
                    className={`w-full text-left py-3 px-3 rounded-lg transition-colors duration-200 ${
                      activeSection === "seller-list" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("seller-list")}
                  >
                    <span className="hidden sm:block">Sellers List</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=buyer-list">
                  <button
                    className={`w-full text-left py-3 px-3 rounded-lg transition-colors duration-200 ${
                      activeSection === "buyer-list" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("buyer-list")}
                  >
                    <span className="hidden sm:block">Buyers List</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=restricted-sellers">
                  <button
                    className={`w-full text-left py-3 px-3 rounded-lg transition-colors duration-200 ${
                      activeSection === "restricted-sellers" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("restricted-sellers")}
                  >
                    <span className="hidden sm:block"> Restricted Sellers</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=restricted-buyers">
                  <button
                    className={`w-full text-left py-3 px-3 rounded-lg transition-colors duration-200 ${
                      activeSection === "restricted-buyers" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("restricted-buyers")}
                  >
                    <span className="hidden sm:block">Restricted Buyers</span>
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=settings">
                  <button
                    className={`w-full text-left py-3 px-3 rounded-lg transition-colors duration-200 ${
                      activeSection === "settings" ? "active" : ""
                    }`}
                    onClick={() => handleSectionChange("settings")}
                  >
                    <span className="hidden sm:block">Settings</span>
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
          <main className="w-4/5 p-5">
            {activeSection === "dashboard" && <DashboardTab />}
            {activeSection === "profile" && <ProfileTab />}
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
