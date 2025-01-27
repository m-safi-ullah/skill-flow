import React, { useContext, useState } from "react";
import logo from "../images/logoDark.png";
import { Link } from "react-router-dom";
import "../css/Header.css";
import { GlobalContext } from "./context/context.jsx";
import { useCookies } from "react-cookie";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { authName, setAuthName } = useContext(GlobalContext);
  const [cookies, removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    removeCookie("token", "");
    setAuthName("");
  };
  return (
    <header>
      <nav className="bg-white shadow-sm header-main">
        <div className="container mx-auto px-4 flex items-center justify-between py-4">
          <div>
            <Link to="/">
              <img src={logo} alt="Logo" className="w-40" />
            </Link>
          </div>

          <button
            className="block md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } fixed inset-0 bg-white md:bg-transparent md:relative md:flex md:items-center md:space-x-4 transition-all duration-300 z-50 pt-10 sm:pt-0`}
          >
            <div className="flex menu flex-col md:flex-row space-y-4 md:space-y-0 items-center">
              <Link
                to="#"
                className="text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Product
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                to="#"
                className="text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Open Source
              </Link>

              {cookies.token ? (
                <div className="relative group dropdown">
                  <button className="text-gray-600 hover:text-gray-800 font-medium flex items-center">
                    Hi, {authName.split(" ")[0]}{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-2 transition-transform rotate-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 9l6 6 6-6"
                      />
                    </svg>
                  </button>

                  <div className="absolute right-0 hidden group-hover:block bg-white shadow-lg rounded-md z-10 w-48">
                    <ul className="py-2">
                      <li onClick={() => setMenuOpen(false)}>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li onClick={() => setMenuOpen(false)}>
                        <Link
                          to="/sign-in"
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                          onClick={handleLogout}
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/become-a-seller"
                    className="text-gray-600 hover:text-gray-800 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Become a seller
                  </Link>
                  <Link
                    to="/sign-in"
                    className="text-gray-600 hover:text-gray-800 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/sign-up"
                    className="bg-[#63D84F] text-white rounded-md hover:bg-green-500"
                    onClick={() => setMenuOpen(false)}
                  >
                    Join
                  </Link>
                </>
              )}
            </div>

            <button
              className="absolute top-4 right-4 text-gray-600 md:hidden focus:outline-none"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
