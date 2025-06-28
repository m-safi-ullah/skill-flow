import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../../baseURL/axios";
import PageNotFound from "../MainPages/PageNotFound.jsx";
import Loading from "../../Symbols/Loading.jsx";
import defaultProfilePic from "../../images/defaultProfilePic.png";

const Profile = ({ portal }) => {
  const location = useLocation();
  const [profile, setProfile] = useState({});
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [found, setFound] = useState(true);
  const [loadVisibility, setLoadVisibility] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoadVisibility(true);
      const name = location.pathname.split("/")[2];

      try {
        const profileRes = await axios.get("/dashboard/getProfile", {
          params: { name, portal },
        });
        setProfile(profileRes.data.profile);
        setFound(true);
        setLoadVisibility(false);
        if (portal !== "buyer") {
          const [productsRes, portfolioRes] = await Promise.all([
            axios.get("/dashboard/getProduct", { params: { name, portal } }),
            axios.get("/dashboard/getPortfolio", { params: { name } }),
          ]);

          setProducts(productsRes.data.products.reverse() || []);
          setPortfolio(portfolioRes.data.products.reverse() || []);
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

  const renderProducts = (items, section) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {items.map((product) => (
          <Link
            to={
              section === "product"
                ? `/${profile?.username}${
                    product.title
                      ? `/${product.title.toLowerCase().replace(/ /g, "-")}`
                      : ""
                  }?id=${product._id}`
                : `/${profile?.username}/portfolio/${product._id}`
            }
            key={product._id}
          >
            <div key={product._id}>
              {product.image && (
                <img
                  src={`http://localhost:4400/${product.image[0]}`}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}

              <div className="flex items-center gap-2 mb-2">
                <img
                  src={
                    profile.profilePic
                      ? `http://localhost:4400/${profile.profilePic}`
                      : defaultProfilePic
                  }
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover border"
                />
                <span className="text-xs">{profile.name}</span>
              </div>
              <h4 className="text-xs font-normal">{product.title}</h4>

              {/* <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {product.description}
              </p> */}
              {true && (
                <div className="flex gap-1 mt-2 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    className="bi bi-star-fill text-yellow-500"
                    width="14"
                    height="14"
                  >
                    <path d="M3.612 15.443c-.398.233-.867-.199-.785-.656l.852-4.909-3.583-3.307c-.327-.301-.156-.888.282-.94l4.942-.72 2.042-4.918c.182-.445.684-.445.866 0l2.042 4.918 4.942.72c.438.052.609.64.282.94l-3.583 3.307.852 4.909c.082.457-.387.889-.785.656L8 12.533l-4.388 2.91z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {/* {product.rating} */}
                    5.0 (1)
                  </span>
                </div>
              )}
              <p className=" mt-2 font-semibold">Rs. {product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  if (!found) return <PageNotFound />;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-16">
      {loadVisibility ? (
        <Loading visible={loadVisibility} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center gap-6 ">
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
              <h1 className="text-2xl font-semibold">{profile.name}</h1>
              <p className="text-gray-600">@{profile?.username}</p>
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
          <section className="mt-8 border p-5 rounded-md w-[70%]">
            <h2 className="text-xl font-medium mb-2">About</h2>
            <p className="text-gray-700">
              {profile.about || "No description provided."}
            </p>
          </section>

          {/* Products, Skills and Portfolio*/}
          {portal !== "buyer" && (
            <>
              <section className="mt-10 border p-5 rounded-md w-[70%]">
                <h2 className="text-xl font-medium mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {renderTags(profile?.skills)}
                </div>
              </section>
              {
                <section className="mt-10 border p-5 rounded-md w-[70%]">
                  <h2 className="text-xl font-medium mb-4">Products</h2>
                  {products.length > 0 ? (
                    renderProducts(products, "product")
                  ) : (
                    <p className="text-gray-500">No products found.</p>
                  )}
                </section>
              }
              <section className="mt-10 border p-5 rounded-md w-[70%]">
                <h2 className="text-xl font-medium mb-4">Portfolio</h2>
                {portfolio.length > 0 ? (
                  renderProducts(portfolio, "portfolio")
                ) : (
                  <p className="text-gray-500 ">No portfolio items found.</p>
                )}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
