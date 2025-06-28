import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../baseURL/axios";
import Loading from "../../Symbols/Loading";
import Toast from "../../Symbols/Toast";
import defaultProfilePic from "../../images/defaultProfilePic.png";

const PortfolioPage = () => {
  const { username, id } = useParams();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ status: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileRes = await axios.get("/dashboard/getProfile", {
          params: { name: username, portal: "seller" },
        });
        if (profileRes.data.success) setProfile(profileRes.data.profile);

        const portfolioRes = await axios.get("/dashboard/getPortfolio", {
          params: { name: username },
        });
        if (portfolioRes.data.success) {
          const items = portfolioRes.data.products.reverse();
          setPortfolio(items);

          // If ID is in the URL, open modal
          if (id) {
            const match = items.find((item) => item._id === id);
            if (match) setSelectedItem(match);
          }
        } else {
          setToast({ status: "error", message: "Failed to fetch portfolio" });
        }
      } catch (error) {
        setToast({
          status: "error",
          message: error.response?.data?.message || "Error loading data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, id]);

  // Handle opening modal and updating URL
  const handleOpen = (item) => {
    setSelectedItem(item);
    navigate(`/${username}/portfolio/${item._id}`);
  };

  // Handle closing modal and resetting URL
  const handleClose = () => {
    setSelectedItem(null);
    navigate(`/${username}/portfolio`);
  };

  return (
    <div className="px-8 py-12 min-h-screen">
      <Toast status={toast.status} message={toast.message} />
      <Loading visible={loading} />

      {/* Profile Section */}
      {profile && (
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <img
            src={
              profile.profilePic
                ? `http://localhost:4400/${profile.profilePic.replace(
                    "\\",
                    "/"
                  )}`
                : defaultProfilePic
            }
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
            <p className="text-gray-600">@{profile?.username}</p>
            <p className="text-sm text-gray-600 mt-2 mb-1 gap-1 flex items-center">
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
              {profile.email}
            </p>
            <p className="text-sm text-gray-600 gap-1 flex items-center">
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
              {profile.address || "Address not added"}
            </p>
          </div>
        </div>
      )}

      {/* Portfolio Section */}
      <div className="max-w-7xl mx-auto">
        {portfolio.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">
            No portfolio items found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {portfolio.map((item) => (
              <div
                key={item._id}
                onClick={() => handleOpen(item)}
                className="bg-white border rounded-lg p-4 cursor-pointer"
              >
                {item.image?.[0] && (
                  <img
                    src={`http://localhost:4400/${item.image[0].replace(
                      "\\",
                      "/"
                    )}`}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-gray-500 my-2 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-primary font-medium">Rs {item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white max-w-3xl w-full rounded-lg overflow-auto max-h-[90vh] relative p-14">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
              onClick={handleClose}
            >
              &times;
            </button>

            <div className="flex items-center gap-2 mb-4">
              <img
                src={
                  profile.profilePic
                    ? `http://localhost:4400/${profile.profilePic.replace(
                        "\\",
                        "/"
                      )}`
                    : defaultProfilePic
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="text-sm text-gray-500">Made by</span>
              <Link to={`/seller/${profile.username}`}>
                <strong className="text-md">{profile.name}</strong>
              </Link>
            </div>

            <h2 className="text-2xl font-bold mb-3">{selectedItem.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 text-sm gap-4 mb-4">
              <div>
                <strong className="block text-gray-800">Price</strong>
                {selectedItem.price}
              </div>
              <div>
                <strong className="block text-gray-800">
                  Project duration
                </strong>
                {selectedItem.duration || "Not specified"}
              </div>
            </div>

            <p className="text-gray-600 whitespace-pre-line mb-4 text-md">
              {selectedItem.description}
            </p>

            {selectedItem.image?.[0] && (
              <img
                src={`http://localhost:4400/${selectedItem.image[0].replace(
                  "\\",
                  "/"
                )}`}
                alt="Project Preview"
                className="w-full rounded-md mt-4"
              />
            )}

            {selectedItem.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {JSON.parse(selectedItem.tags).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
