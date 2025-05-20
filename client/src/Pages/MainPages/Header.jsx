import React, { useContext, useState } from "react";
import logo from "../../images/logoDark.png";
import "../../css/Header.css";
import { GlobalContext } from "../context/context.jsx";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { authName, setAuthName } = useContext(GlobalContext);
  const [cookies, removeCookie] = useCookies(["token"]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("token", "");
    setAuthName("");
    window.location.href = "/";
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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

          <div className="relative w-full max-w-xs mx-4 hidden lg:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search for services or products..."
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              className="absolute inset-y-0 left-3 flex items-center text-gray-400 cursor-pointer"
              onClick={handleSearch}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1110 2.5a7.5 7.5 0 016.65 14.15z"
                />
              </svg>
            </div>
          </div>

          <div
            className={`${
              menuOpen ? "block" : "hidden"
            } fixed inset-0 z-40 bg-white lg:bg-transparent lg:relative lg:flex lg:items-center lg:space-x-4  transition-all duration-300 pt-10 lg:pt-0`}
          >
            <div className="flex menu flex-col lg:flex-row space-y-4 lg:space-y-0 items-center">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about-us"
                className="text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/faq"
                className="text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/service"
                className="text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Services
              </Link>

              {cookies.token ? (
                <>
                  <Link to="/chat">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0-2a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6z"
                      />
                    </svg>
                  </Link>
                  <div className="relative group dropdown cursor-pointer">
                    <div className="flex">
                      Hi, {authName?.split(" ")[0]}{" "}
                      <svg
                        className="h-5 w-5 text-gray-500 "
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
                </>
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
