import React, { useEffect, useState } from "react";
import axios from "../../../baseURL/axios";
import Toast from "../../../Symbols/Toast";
import Loading from "../../../Symbols/Loading";
import { FaEdit, FaEye } from "react-icons/fa";
import DeleteModal from "../../../Symbols/DeleteModal";
import { Link, useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState({ status: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/dashboard/getProduct");
        if (response.data.success) {
          setProducts(response.data.products.reverse());
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

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete("/dashboard/deleteProduct", {
        params: { productId },
      });
      if (response.data.success) {
        setToast({
          status: "success",
          message: "Product deleted successfully!",
        });
        setProducts((prev) =>
          prev.filter((product) => product._id !== productId)
        );
      }
    } catch (error) {
      setToast({ status: "error", message: "Failed to delete product" });
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard?tab=create-product&id=${id}`);
  };

  return (
    <div className="p-6">
      <Loading visible={loading} />
      <Toast status={toast.status} message={toast.message} />
      <h3 className="text-xl font-medium mb-4">Product List</h3>

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full bg-white text-center">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-gray-600 font-semibold">#</th>
              <th className="py-3 px-4 text-gray-600 font-semibold">Image</th>
              <th className="py-3 px-4 text-gray-600 font-semibold">Title</th>
              <th className="py-3 px-4 text-gray-600 font-semibold">Price</th>
              <th className="py-3 px-4 text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className="border-b hover:bg-gray-50 transition "
              >
                <td className="py-4 px-4 text-center align-middle">
                  {index + 1}
                </td>
                <td className="py-4 px-4 align-middle">
                  {product.image?.length > 0 && (
                    <img
                      src={`http://localhost:4400/${product.image[0]}`}
                      alt={product.title}
                      className="h-12 w-12 object-cover rounded-lg border border-gray-200 block mx-auto"
                    />
                  )}
                </td>
                <td className="py-4 px-4 text-gray-800">{product.title}</td>
                <td className="py-4 px-4 text-gray-800 font-medium align-middle">
                  Rs.{product.price}
                </td>
                <td className="py-6 px-4 flex justify-center items-center gap-4">
                  <Link
                    to={`/${product.username}/${product.title
                      .toLowerCase()
                      .replace(/ /g, "-")}?id=${product._id}`}
                    className="transition-transform duration-200 transform hover:scale-110"
                  >
                    <FaEye className="text-gray-600 text-xl hover:text-gray-800" />
                  </Link>
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="transition-all duration-200 hover:text-primary hover:scale-110"
                  >
                    <FaEdit className="text-primary text-xl" />
                  </button>
                  <DeleteModal handleDelete={() => handleDelete(product._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && !loading && (
        <p className="text-gray-500 text-center mt-4">No products found</p>
      )}
    </div>
  );
};

export default ProductList;
