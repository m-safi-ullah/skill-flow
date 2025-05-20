import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { GlobalContext } from "../../context/context.jsx";
import defaultProfilePic from "../../../images/defaultProfilePic.png";
import axios from "../../../baseURL/axios";
import Loading from "../../../Symbols/Loading.jsx";
import { FaEye, FaPen, FaTimes, FaCheck } from "react-icons/fa";
import Toast from "../../../Symbols/Toast.jsx";

const DashboardTab = () => {
  const { authEmail, authRole } = useContext(GlobalContext);
  const location = useLocation();
  const tab = new URLSearchParams(location.search).get("tab");

  const [profileData, setProfileData] = useState({});
  const [username, setUsername] = useState();
  const [editUsername, setEditUsername] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ status: "", message: "" });

  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    if (tab === "dashboard") {
      setLoading(true);
      axios
        .get("/dashboard/getProfile")
        .then((res) => {
          if (res.data.success) {
            const { profile } = res.data;
            setProfileData(profile);
            setUsername(profile.username);
          }
        })
        .catch((err) => console.error("Error fetching profile:", err))
        .finally(() => setLoading(false));
    }
  }, [tab]);

  const handleUsernameChange = (newUsername) => {
    setLoading(true);
    axios
      .post("/dashboard/updateUsername", { username: newUsername })
      .then((res) => {
        if (res.data.success) {
          const { profile } = res.data;
          setProfileData(profile);
          setUsername(profile.username);
          setEditUsername(false);
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch((err) => console.error("Error updating username:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/dashboard/getProduct");
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setToast({ status: "error", message: "Failed to fetch products" });
        }
      } catch (error) {
        setToast({
          status: "error",
          message: error.response?.data?.message || "Error fetching products",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/dashboard/getPortfolio");
        if (response.data.success) {
          setPortfolio([...response.data.products].reverse());
        } else {
          setToast({ status: "error", message: "Failed to fetch portfolio" });
        }
      } catch (error) {
        setToast({
          status: "error",
          message: error.response?.data?.message || "Error fetching portfolio",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  return (
    <>
      <Loading visible={loading} />
      <Toast status={toast.status} message={toast.message} />

      <div className="flex flex-wrap gap-5">
        {/* Profile */}
        {profileData && (
          <div className="bg-white border rounded-lg p-6 w-[100%] relative">
            <span className="gap-2 flex justify-end absolute right-4 top-4">
              <Link
                to="/dashboard?tab=profile"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-800  font-medium px-2 hover:bg-gray-100 py-2 rounded-md text-sm transition "
              >
                <FaPen className="text-gray-600 text-sm" />
                Edit
              </Link>
              <Link
                to={`/${authRole}/${profileData.username}`}
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-800  font-medium px-2 hover:bg-gray-100 py-2 rounded-md text-sm transition "
              >
                <FaEye className="text-gray-600 text-xl" />
                Preview
              </Link>
            </span>

            <div className="flex items-center">
              <img
                src={
                  profileData.profilePic
                    ? `http://localhost:4400/${profileData.profilePic}`
                    : defaultProfilePic
                }
                alt="Profile Picture"
                className="w-20 h-20 rounded-full"
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{profileData.name}</h2>
                <p className="text-gray-500 text-sm  flex">
                  @
                  {editUsername && (
                    <input
                      type="text"
                      className="outline-none border-b border-gray-300 mr-2 focus:border-green-500 w-24"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                      readOnly={!editUsername}
                    />
                  )}
                  {!editUsername && (
                    <span className="text-gray-500 text-sm mr-2">
                      {username}
                    </span>
                  )}
                  <span className="my-auto">
                    {!editUsername && (
                      <FaPen
                        className="cursor-pointer"
                        onClick={() => {
                          setEditUsername(true);
                        }}
                      />
                    )}
                    {editUsername && (
                      <span className="flex gap-1">
                        <FaCheck
                          className="text-green-600 cursor-pointer"
                          onClick={() => {
                            setEditUsername(true);
                            handleUsernameChange(username);
                          }}
                        />
                        <FaTimes
                          className="text-red-600 cursor-pointer"
                          onClick={() => {
                            setUsername(profileData.username);
                            setEditUsername(false);
                            setError(false);
                          }}
                        />
                      </span>
                    )}
                  </span>
                </p>
                {error && (
                  <span className="text-red-500 text-xs">
                    Username is not avialable
                  </span>
                )}

                <p className="text-sm text-gray-600 flex items-center gap-1 mt-2 mb-1">
                  <svg
                    className="h-4 w-4"
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

                  {authEmail}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {profileData.address || "Address not added"}
                </p>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <h2 className="text-md font-medium">About</h2>
              <p className="text-sm mt-1">
                {profileData?.about
                  ? profileData.about.substring(0, 300)
                  : "No description available"}
                ...
              </p>
            </div>
            {authRole == "seller" && (
              <div className="mt-4 border-t pt-4">
                <h2 className="text-md font-medium">Skills and Expertise</h2>
                <ul className="text-sm mt-1 flex flex-wrap gap-2 ">
                  {profileData?.skills &&
                  JSON.parse(profileData?.skills).length > 0
                    ? JSON.parse(profileData?.skills || "[]").map(
                        (skill, index) => (
                          <li
                            className="bg-gray-100 px-2 rounded-md"
                            key={index}
                          >
                            {skill}
                          </li>
                        )
                      )
                    : "No skills added"}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Dashboard */}
        <div className="bg-white border rounded-lg p-6 w-[49%]">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-2">
            Welcome to your dashboard! Here you can manage your profile,
            products, and portfolio.
          </p>
          <div className="mt-4 border-t pt-4">
            <h2 className="text-md font-medium">Quick Links</h2>
            <ul className="text-sm mt-2 flex flex-col gap-2">
              <Link
                to="/dashboard?tab=profile"
                className="text-gray-600 hover:text-gray-800"
              >
                Profile
              </Link>
              {authRole == "seller" && (
                <Link
                  to="/dashboard?tab=product-list"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Products
                </Link>
              )}
              {authRole == "seller" && (
                <Link
                  to="/dashboard?tab=portfolio"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Portfolio
                </Link>
              )}
            </ul>
          </div>
        </div>

        {/* Product */}
        {authRole == "seller" && (
          <>
            <div className="bg-white border relative rounded-lg p-6 w-[48%]">
              <span className="gap-2 flex absolute right-4 top-4">
                <Link
                  to={`/dashboard?tab=product-list`}
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-800  font-medium px-2 hover:bg-gray-100 py-2 rounded-md text-sm transition "
                >
                  <FaEye className="text-gray-600 text-xl" />
                  View All
                </Link>
              </span>
              {/* Latest Product */}
              <h2 className="text-xl font-semibold">Latest Product</h2>
              <p className="text-gray-500 text-sm mt-2">
                Showcase your work and projects here.
              </p>
              <div className="mt-4 border-t pt-4">
                {products.length > 0 ? (
                  <>
                    {products
                      .reverse()
                      .slice(0, 1)
                      .map((products) => (
                        <div
                          key={products._id}
                          className="bg-white rounded-lg p-4 transition-shadow"
                        >
                          {products.image && (
                            <div>
                              <img
                                src={`http://localhost:4400/${products.image[0]}`}
                                alt={products.title}
                                className="w-full h-48 object-cover rounded-md mb-4"
                              />
                            </div>
                          )}
                          <h4 className="text-lg font-semibold truncate">
                            {products.title}
                          </h4>
                          <p className="text-secondry my-2 font-medium">
                            Rs {products.price}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {products.description}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-1">
                            {products?.tags &&
                            JSON.parse(products?.tags).length > 0
                              ? JSON.parse(products?.tags || "[]").map(
                                  (skill, index) => (
                                    <span
                                      className="bg-gray-100 px-2 mr-1 rounded-md"
                                      key={index}
                                    >
                                      {skill}
                                    </span>
                                  )
                                )
                              : "No skills added"}
                          </div>
                        </div>
                      ))}
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No product found. Add your first item by clicking Add New!
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Portfolio */}
        {authRole == "seller" && (
          <div className="bg-white border relative rounded-lg p-6 w-[49%]">
            <span className="gap-2 flex absolute right-4 top-4">
              <Link
                to={`/dashboard?tab=portfolio`}
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-800  font-medium px-2 hover:bg-gray-100 py-2 rounded-md text-sm transition "
              >
                <FaEye className="text-gray-600 text-xl" />
                View All
              </Link>
            </span>
            <h2 className="text-xl font-semibold">Latest Portfolio</h2>
            <p className="text-gray-500 text-sm mt-2">
              Showcase your work and projects here.
            </p>
            <div className="mt-4 border-t pt-4">
              {portfolio.length > 0 ? (
                <>
                  {portfolio
                    .reverse()
                    .slice(0, 1)
                    .map((portfolio) => (
                      <div
                        key={portfolio._id}
                        className="bg-white rounded-lg p-4 transition-shadow"
                      >
                        {portfolio.image && (
                          <div>
                            <img
                              src={`http://localhost:4400/${portfolio.image}`}
                              alt={portfolio.title}
                              className="w-full h-48 object-cover rounded-md mb-4"
                            />
                          </div>
                        )}
                        <h4 className="text-lg font-semibold truncate">
                          {portfolio.title}
                        </h4>
                        <p className="text-secondry my-2 font-medium">
                          Rs {portfolio.price}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {portfolio.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-1">
                          {portfolio?.tags &&
                          JSON.parse(portfolio?.tags).length > 0
                            ? JSON.parse(portfolio?.tags || "[]").map(
                                (skill, index) => (
                                  <span
                                    className="bg-gray-100 px-2 mr-1 rounded-md"
                                    key={index}
                                  >
                                    {skill}
                                  </span>
                                )
                              )
                            : "No skills added"}
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No portfolio items found. Add your first item by clicking Add
                  New!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
// lg:w-[calc(50%-0.75rem)] w-[100%]
export default DashboardTab;
