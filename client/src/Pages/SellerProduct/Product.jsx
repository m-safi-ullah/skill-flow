import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../../baseURL/axios";
import { FaStar } from "react-icons/fa";
import dummyImage from "../../images/defaultProfilePic.png";
import Carousel from "../../Symbols/Carousel";
import Loading from "../../Symbols/Loading";
import Toast from "../../Symbols/Toast";
import { GlobalContext } from "../context/context.jsx";
import BreadCrumbs from "../../Symbols/BreadCrumbs.jsx";

const Product = () => {
  const { authRole, authEmail } = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [profile, setProfile] = useState({});
  const [groupProducts, setGroupProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const location = useLocation();
  const id = location?.search.split("=")[1];
  const username = location?.pathname.split("/")[1];
  const portal = "seller";
  const [placeOrder, setPlaceOrder] = useState(false);
  const [toast, setToast] = useState({ status: "", message: "" });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productRes = await axios.get(`/dashboard/getProductById`, {
          params: { id },
        });
        setProduct(productRes.data.product);

        const name = location.pathname.split("/")[1];

        const profileRes = await axios.get("/dashboard/getProfile", {
          params: { name, portal },
        });
        setProfile(profileRes.data.profile);

        const [productsRes, portfolioRes] = await Promise.all([
          axios.get("/dashboard/getProduct", { params: { name, portal } }),
          axios.get("/dashboard/getPortfolio", { params: { name } }),
        ]);

        setGroupProducts(productsRes.data.products || []);
        setPortfolio(portfolioRes.data.products || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, location.pathname, portal]);

  const handleOrderSubmit = async (e) => {
    setToast({
      status: "",
      message: "",
    });
    e.preventDefault();
    try {
      const formData = new FormData(e.target);

      formData.append("title", product.title);
      formData.append("price", product.price);
      formData.append("isFile", product.isFile);
      formData.append("id", id);
      formData.append("username", username);

      const res = await axios.post("/order/place-order", formData);

      if (res.data.success) {
        setToast({
          status: "success",
          message: "Order placed successfully",
        });
        setPlaceOrder(false);
      } else {
        console.warn("Order placement failed:", res.data.message);
        setToast({
          status: "error",
          message: res.data.message,
        });
      }
    } catch (err) {
      setToast({
        status: "error",
        message: err,
      });
    }
  };

  const renderProducts = (items, section) => {
    const limitedItems = items.slice(0, 3);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {limitedItems.map((product) => (
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
            <div>
              {product.image && (
                <img
                  src={`http://localhost:4400/${product.image[0]}`}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}

              <div className="flex items-center gap-2 mb-2">
                {section === "product" && (
                  <>
                    <img
                      src={
                        profile.profilePic
                          ? `http://localhost:4400/${profile.profilePic}`
                          : dummyImage
                      }
                      alt="Profile"
                      className="w-6 h-6 rounded-full object-cover border"
                    />
                    <span className="text-xs">{profile.name}</span>
                  </>
                )}
              </div>
              <h4 className="text-sm font-medium">{product.title}</h4>

              {section === "product" && (
                <>
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
                    <span className="text-sm font-medium">5.0 (1)</span>
                  </div>
                  <p className="mt-2 font-semibold">Rs. {product.price}</p>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const handleContactMe = () => {
    console.log(product.profileId);
  };

  return (
    <div className="container mx-auto py-10 px-12">
      <Loading visible={loading} />
      <Toast status={toast.status} message={toast.message} />
      {product && (
        <div className="flex gap-8">
          <div className="w-2/3">
            <BreadCrumbs
              link2={`/${portal}/${username}`}
              name2={username[0].toUpperCase() + username.slice(1)}
              link3={`/${username}/${product?.title
                .toLowerCase()
                .replace(/ /g, "-")}?id=${product._id}`}
              name3={product.title}
            />
            <div className="bg-white rounded-md mt-4 mb-12">
              <h1 className="text-2xl font-semibold mb-4">{product.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <img
                    src={
                      profile.profilePic
                        ? `http://localhost:4400/${profile.profilePic}`
                        : dummyImage
                    }
                    alt="Profile"
                    className="w-10 rounded-full object-cover border"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-normal">M Safi Ullah</p>
                  <div className="flex items-center">
                    <div className="flex text-yellow-500">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className="ml-2 text-sm font-semibold">5.0</span>
                    <span className="ml-2 text-sm text-gray-500">
                      (8 reviews)
                    </span>
                  </div>
                </div>
              </div>
              <Carousel images={product.image} />
            </div>

            {/* About This Gig Section */}
            <div>
              <h2 className="text-lg font-normal mb-4">About This Gig</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-6 mt-12">
              <img
                src={
                  profile.profilePic
                    ? `http://localhost:4400/${profile.profilePic}`
                    : dummyImage
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border"
              />
              <div>
                <Link to={`/seller/${username}`}>
                  <h1 className="text-2xl font-semibold">{profile.name}</h1>
                </Link>
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
            <section className="mt-8 border p-5 rounded-md">
              <h2 className="text-xl font-medium mb-2">About</h2>
              <p className="text-gray-700">
                {profile.about || "No description provided."}
              </p>
            </section>

            {/* Products */}
            <section className="mt-10 border p-5 rounded-md">
              <h2 className="text-xl font-medium mb-4">Products</h2>
              {groupProducts.length > 0 ? (
                renderProducts(groupProducts, "product")
              ) : (
                <p className="text-gray-500">No products found.</p>
              )}
            </section>

            {/* Portfolio */}
            <section className="mt-10 border p-5 rounded-md">
              <h2 className="text-xl font-medium mb-4">My Portfolio</h2>
              {portfolio.length > 0 ? (
                renderProducts(portfolio, "portfolio")
              ) : (
                <p className="text-gray-500">No portfolio items found.</p>
              )}
            </section>
          </div>
          <div className="w-1/3 mt-10 hidden md:block">
            <div className="bg-white rounded-lg p-4 border sticky top-10">
              <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Pricing</h2>
                {product.price && (
                  <p className="text-lg font-medium mb-4">
                    Rs. {product.price}
                  </p>
                )}
              </div>
              <p className="text-sm my-4">{product.shortDescription}</p>
              {product.email !== authEmail && (
                <Link
                  to={
                    authEmail
                      ? "/chat"
                      : `/sign-in?redirectUrl=${encodeURIComponent(
                          window.location.href
                        )}`
                  }
                >
                  <button
                    className="mt-4 bg-secondry text-white py-2 px-4 rounded-md w-full"
                    onClick={handleContactMe}
                  >
                    Contact Me
                  </button>
                </Link>
              )}
              {authRole && authRole !== "seller" && (
                <button
                  onClick={() => {
                    setPlaceOrder(true);
                  }}
                  className="mt-4 bg-primary text-white py-2 px-4 rounded-md w-full"
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {placeOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-40 pt-10 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 m-4">
            {/* Close Button */}
            <button
              onClick={() => setPlaceOrder(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>

            <form onSubmit={handleOrderSubmit}>
              <h2 className="text-xl font-semibold mb-4">
                {!product.isFile ? "Delivery Address" : "Share Requirements"}
              </h2>

              {!product.isFile && (
                <>
                  <div className="mb-4">
                    <label className="block font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full border border-gray-300 px-4 py-2 rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-medium mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="w-full border border-gray-300 px-4 py-2 rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-medium mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      className="w-full border border-gray-300 px-4 py-2 rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block font-medium mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      className="w-full border border-gray-300 px-4 py-2 rounded"
                    />
                  </div>
                </>
              )}

              <h3 className="text-xl font-semibold mt-6 mb-2">
                Additional Requirements
              </h3>

              <div className="mb-6">
                <textarea
                  name="additionalRequirements"
                  rows="3"
                  className="w-full border border-gray-300 px-4 py-2 rounded"
                  placeholder="Any special instructions or requests..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
