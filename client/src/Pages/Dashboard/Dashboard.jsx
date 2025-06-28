import { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { GlobalContext } from "../context/context.jsx";
import Admin from "./Admin.jsx";
import Buyer from "./Buyer.jsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardTab from "./Tabs/DashboardTab.jsx";
import ProfileTab from "./Tabs/ProfileTab.jsx";
import Seller from "./Seller.jsx";
import SettingTab from "./Tabs/SettingTab.jsx";
import Loading from "../../Symbols/Loading.jsx";
import RestrcitedTab from "./Tabs/RestrictedTab.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const { authRole, restricted } = useContext(GlobalContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarHeight, setSidebarHeight] = useState("calc(100vh - 4rem)");
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 64) {
        setSidebarHeight("100vh");
      } else {
        setSidebarHeight("calc(100vh - 4rem)");
      }
    };
    const tabName = location.search?.split("&")[0].split("=");
    if (tabName[1]) {
      setActiveSection(tabName[1]);
    } else {
      navigate("?tab=dashboard");
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  useEffect(() => {
    setLoading(false);
    if (!cookies.token) {
      navigate("/sign-in");
    }
  }, [cookies.token]);

  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const toggleProductDropdown = () => {
    setProductDropdownOpen(!productDropdownOpen);
  };

  return (
    <div>
      <Loading visible={loading} />
      <div className=" dashboard ">
        {!restricted ? (
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
                    <button
                      onClick={toggleProductDropdown}
                      className="w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200"
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
                      <span className="hidden sm:block">Admin</span>
                      <svg
                        className={`h-7 w-7 text-gray-500  ${
                          productDropdownOpen ? "pr-2 rotate-180" : "pl-2"
                        }`}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {productDropdownOpen && (
                      <ul className="space-y-2 pl-8 mt-2">
                        <li>
                          <Link to="/dashboard?tab=add-new-admin">
                            <button
                              className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                                activeSection === "add-new-admin"
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleSectionChange("add-new-admin")
                              }
                            >
                              <svg
                                className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="4"
                                  y="4"
                                  width="16"
                                  height="16"
                                  rx="4"
                                  stroke="currentColor"
                                  fill="none"
                                />
                                <line
                                  x1="12"
                                  y1="8"
                                  x2="12"
                                  y2="16"
                                  stroke="currentColor"
                                />
                                <line
                                  x1="8"
                                  y1="12"
                                  x2="16"
                                  y2="12"
                                  stroke="currentColor"
                                />
                              </svg>
                              <span className="hidden sm:block">Add Admin</span>
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
                                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                                <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />{" "}
                                <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />{" "}
                                <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />{" "}
                                <line x1="11" y1="6" x2="20" y2="6" />{" "}
                                <line x1="11" y1="12" x2="20" y2="12" />{" "}
                                <line x1="11" y1="18" x2="20" y2="18" />
                              </svg>
                              <span className="hidden sm:block">
                                Admin List
                              </span>
                            </button>
                          </Link>
                        </li>
                      </ul>
                    )}
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
                            activeSection === "restricted-sellers"
                              ? "active"
                              : ""
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
                            activeSection === "restricted-buyers"
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            handleSectionChange("restricted-buyers")
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
                      <button
                        onClick={toggleProductDropdown}
                        className="w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200"
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
                          <rect x="4" y="4" width="16" height="6" rx="2" />{" "}
                          <rect x="4" y="14" width="16" height="6" rx="2" />
                        </svg>
                        <span className="hidden sm:block">Products</span>
                        <svg
                          className={`h-7 w-7 text-gray-500  ${
                            productDropdownOpen ? "pr-2 rotate-180" : "pl-2"
                          }`}
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {productDropdownOpen && (
                        <ul className="space-y-2 pl-5 mt-2">
                          <li>
                            <Link to="/dashboard?tab=create-product">
                              <button
                                className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                                  activeSection === "create-product"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSectionChange("create-product")
                                }
                              >
                                <svg
                                  className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <rect
                                    x="4"
                                    y="4"
                                    width="16"
                                    height="16"
                                    rx="4"
                                    stroke="currentColor"
                                    fill="none"
                                  />
                                  <line
                                    x1="12"
                                    y1="8"
                                    x2="12"
                                    y2="16"
                                    stroke="currentColor"
                                  />
                                  <line
                                    x1="8"
                                    y1="12"
                                    x2="16"
                                    y2="12"
                                    stroke="currentColor"
                                  />
                                </svg>

                                <span>Create Product</span>
                              </button>
                            </Link>
                          </li>
                          <li>
                            <Link to="/dashboard?tab=product-list">
                              <button
                                className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                                  activeSection === "product-list"
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSectionChange("product-list")
                                }
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
                                <span>Product List</span>
                              </button>
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <Link to="/dashboard?tab=portfolio">
                        <button
                          className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                            activeSection === "portfolio" ? "active" : ""
                          }`}
                          onClick={() => handleSectionChange("portfolio")}
                        >
                          <svg
                            className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="16"
                              height="16"
                              rx="4"
                              stroke="currentColor"
                              fill="none"
                            />
                            <line
                              x1="12"
                              y1="8"
                              x2="12"
                              y2="16"
                              stroke="currentColor"
                            />
                            <line
                              x1="8"
                              y1="12"
                              x2="16"
                              y2="12"
                              stroke="currentColor"
                            />
                          </svg>

                          <span>Portfolio</span>
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard?tab=skills-test">
                        <button
                          className={`w-full text-left py-3 px-3 flex group items-center rounded-lg transition-colors duration-200 ${
                            activeSection === "skills-test" ? "active" : ""
                          }`}
                          onClick={() => handleSectionChange("skills-test")}
                        >
                          <svg
                            className="shrink-0 w-5 h-5 mr-3 text-gray-500 transition duration-75 group-hover:text-gray-900"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 2H15C15.55 2 16 2.45 16 3V4H18C19.1 4 20 4.9 20 6V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V6C4 4.9 4.9 4 6 4H8V3C8 2.45 8.45 2 9 2Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12L11 14L15 10"
                            />
                          </svg>

                          <span>Skills Test</span>
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
              {authRole === "seller" && (
                <Seller activeSection={activeSection} />
              )}
            </main>
          </div>
        ) : (
          <>
            <RestrcitedTab />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
