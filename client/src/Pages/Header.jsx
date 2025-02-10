import React, { useContext, useState } from "react";
import logo from "../images/logoDark.png";
import "../css/Header.css";
import { GlobalContext } from "./context/context.jsx";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { authName, setAuthName } = useContext(GlobalContext);
  const [cookies, removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    removeCookie("token", "");
    setAuthName("");
    window.location.href = "/";
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
            className="block lg:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
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
            } fixed inset-0 z-40 bg-white lg:bg-transparent lg:relative lg:flex lg:items-center lg:space-x-4  transition-all duration-300 pt-10 lg:pt-0`}
          >
            <div className="flex menu flex-col lg:flex-row space-y-4 lg:space-y-0 items-center">
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
                <div className="relative group dropdown cursor-pointer">
                  <div className="flex">
                    Hi, {authName?.split(" ")[0]}{" "}
                    <svg
                      className="h-5 w-5 text-gray-500"
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
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  <div className="absolute md:right-0 hidden group-hover:block bg-white shadow-lg rounded-md z-10 w-48">
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
              className="absolute top-4 right-4 text-gray-600 lg:hidden focus:outline-none"
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
