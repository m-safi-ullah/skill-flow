import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "../../baseURL/axios";
import { ToastContainer, Slide } from "react-toastify";

export default function ProductGrid() {
  const location = useLocation();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [priceFilter, setPriceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchQuery(q);
  }, [location.search]);

  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/searchProducts/getProducts", {
        params: {
          page: currentPage,
          limit: 10,
          priceRange: priceFilter || "all",
          search: debouncedSearch || "",
        },
      });
      const { success, products, total, totalPages } = res.data;
      if (success) {
        setProductData(products);
        setTotalProducts(total);
        setTotalPages(totalPages);
      } else {
        setProductData([]);
        setTotalProducts(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, priceFilter, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <ToastContainer autoClose={1000} transition={Slide} hideProgressBar />
      <section className="py-10">
        <div className="container mx-auto px-10">
          <h2 className="text-xl font-semibold mb-4">
            Results for: <span className="text-blue-600">"{searchQuery}"</span>
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : productData.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-6">
                Showing {productData.length} of {totalProducts} products
              </p>

              {/* 👉 Custom Styled Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productData.map((product) => (
                  <Link
                    to={`/${product.username}/${product.title
                      .toLowerCase()
                      .replace(/ /g, "-")}?id=${product._id}`}
                    key={product._id}
                  >
                    <div className="p-4">
                      {product.image && (
                        <img
                          src={`http://localhost:4400/${
                            product.image[0] || product.image
                          }`}
                          alt={product.title}
                          className="w-full h-48 object-cover rounded-md mb-2"
                        />
                      )}

                      <h4 className="text-md">{product.title}</h4>

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
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4">No products found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
