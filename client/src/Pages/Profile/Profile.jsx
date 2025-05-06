import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../baseURL/axios";
import PageNotFound from "../PageNotFound.jsx";
import defaultProfilePic from "../../images/defaultProfilePic.png";

const Profile = ({ portal }) => {
  const location = useLocation();
  const [profile, setProfile] = useState({});
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [found, setFound] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const name = location.pathname.split("/")[2];

      try {
        const profileRes = await axios.get("/dashboard/getProfile", {
          params: { name, portal },
        });
        setProfile(profileRes.data.profile);
        setFound(true);

        if (portal !== "buyer") {
          const [productsRes, portfolioRes] = await Promise.all([
            axios.get("/dashboard/getProduct", { params: { name, portal } }),
            axios.get("/dashboard/getPortfolio", { params: { name } }),
          ]);

          setProducts(productsRes.data.products || []);
          setPortfolio(portfolioRes.data.products || []);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setFound(false);
      }
    };

    fetchProfileData();
  }, [location.pathname, portal]);

  const renderTags = (tags) => {
    try {
      const parsed = JSON.parse(tags || "[]");
      return parsed.length > 0
        ? parsed.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 border rounded-full text-sm"
            >
              {tag}
            </span>
          ))
        : "No skills added";
    } catch {
      return "No skills added";
    }
  };

  const renderProducts = (items) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg border p-4 transition-shadow"
          >
            {product.image && (
              <img
                src={`http://localhost:4400/${product.image[0]}`}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h4 className="text-lg font-semibold truncate">{product.title}</h4>
            <p className="text-secondry font-medium">Rs {product.price}</p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {product.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {renderTags(product?.tags)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!found) return <PageNotFound />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-6 border-b pb-6">
        <img
          src={
            profile.profilePic
              ? `http://localhost:4400/${profile.profilePic}`
              : defaultProfilePic
          }
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-600">@{profile?.email?.split("@")[0]}</p>
          <p className="text-sm text-gray-600 flex items-center mt-2 gap-1 mb-1">
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
            {profile.address || "Address not added"}
          </p>
        </div>
      </div>

      {/* About */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <p className="text-gray-700">
          {profile.about || "No description provided."}
        </p>
      </section>

      {/* Products and Portfolio*/}
      {portal !== "buyer" && (
        <>
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Products</h2>
            {products.length > 0 ? (
              renderProducts(products)
            ) : (
              <p className="text-gray-500 text-center py-4">
                No products found. Add your first item by clicking Add New!
              </p>
            )}
          </section>
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Portfolio</h2>
            {portfolio.length > 0 ? (
              renderProducts(portfolio)
            ) : (
              <p className="text-gray-500 text-center py-4">
                No portfolio items found. Add your first item by clicking Add
                New!
              </p>
            )}
          </section>
          {/* Skills */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {renderTags(profile?.skills)}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Profile;
