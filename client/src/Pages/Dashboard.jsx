import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Dashboard.css";
import { useCookies } from "react-cookie";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [cookies] = useCookies(["token"]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const location = window.location.href;

  useEffect(() => {
    const tabName = location.split("=");
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
    <div className=" dashboard ">
      <div className="flex">
        {/* Sidebar */}
        <nav className="w-1/5 shadow-lg p-5">
          <ul className="space-y-4">
            <li>
              <Link to="/dashboard?tab=dashboard">
                <button
                  className={`w-full text-left py-3 px-3 rounded-lg transition-colors duration-200 ${
                    activeSection === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("dashboard")}
                >
                  <i className="bi bi-house mr-2"></i> Dashboard
                </button>
              </Link>
            </li>
            <li>
              <Link to="/dashboard?tab=profile">
                <button
                  className={`w-full text-left py-3 px-3 rounded-lg transition-colors duration-200 ${
                    activeSection === "profile" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("profile")}
                >
                  <i className="bi bi-person mr-2"></i> Profile
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
                  <i className="bi bi-shop mr-2"></i> Sellers List
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
                  <i className="bi bi-people mr-2"></i> Buyers List
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
                  <i className="bi bi-x-circle mr-2"></i> Restricted Sellers
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
                  <i className="bi bi-x-circle mr-2"></i> Restricted Buyers
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
                  <i className="bi bi-gear mr-2"></i> Settings
                </button>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="w-3/4 p-5">
          {activeSection === "dashboard" && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Dashboard</h3>
              <p>Welcome to the admin dashboard!</p>
            </div>
          )}
          {activeSection === "profile" && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Profile</h3>
              <p>Here is your profile information.</p>
            </div>
          )}
          {activeSection === "seller-list" && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Sellers</h3>
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">ID</th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">John Doe</td>
                    <td className="border border-gray-300 p-2">
                      john@example.com
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">Jane Smith</td>
                    <td className="border border-gray-300 p-2">
                      jane@example.com
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeSection === "buyer-list" && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Buyers</h3>
              <p>Here is the buyer information.</p>
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">ID</th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">John Doe</td>
                    <td className="border border-gray-300 p-2">
                      john@example.com
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">Jane Smith</td>
                    <td className="border border-gray-300 p-2">
                      jane@example.com
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeSection === "restricted-sellers" && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Restricted Sellers</h3>
              <p>These sellers are restricted.</p>
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">ID</th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">John Doe</td>
                    <td className="border border-gray-300 p-2">
                      john@example.com
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">Jane Smith</td>
                    <td className="border border-gray-300 p-2">
                      jane@example.com
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeSection === "restricted-buyers" && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Restricted Buyers</h3>
              <p>These buyers are restricted.</p>
              <table className="w-full text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 p-2">ID</th>
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">1</td>
                    <td className="border border-gray-300 p-2">John Doe</td>
                    <td className="border border-gray-300 p-2">
                      john@example.com
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">2</td>
                    <td className="border border-gray-300 p-2">Jane Smith</td>
                    <td className="border border-gray-300 p-2">
                      jane@example.com
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeSection === "settings" && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Settings</h3>
              <p>Configure your settings here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
