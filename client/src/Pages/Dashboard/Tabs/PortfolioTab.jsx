import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "../../../baseURL/axios";
import Toast from "../../../Symbols/Toast";
import Loading from "../../../Symbols/Loading";
import { FaTrash, FaPen, FaEye } from "react-icons/fa";
import { SkillsArray } from "../../../Symbols/SkillsArray";
import DeleteModal from "../../../Symbols/DeleteModal";
import { Link } from "react-router-dom";

const PortfolioTab = () => {
  const [tags, setTags] = useState([]);
  const [toast, setToast] = useState({ status: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [FormButton, setFormButton] = useState("Submit");
  const [images, setImages] = useState({ file: null, preview: "" });
  const [initialData, setInitialData] = useState(null);
  const tagsOption = SkillsArray;
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [products, setProducts] = useState([]);
  const [formErrors, setFormErrors] = useState({ tags: "", image: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/dashboard/getPortfolio");

        if (response.data.success) {
          setProducts(response.data?.products?.reverse());
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
  }, [showPortfolio]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImages({
        file,
        preview: URL.createObjectURL(file),
      });
    }
    e.target.value = "";
  };

  const handleDeleteImg = (e) => {
    e.stopPropagation();
    setImages({ file: null, preview: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({ tags: "", image: "" });

    let valid = true;
    if (tags.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        tags: "Please add at least one tag.",
      }));
      valid = false;
    }

    if (!images.file && FormButton === "Submit") {
      setFormErrors((prev) => ({ ...prev, image: "Please upload an image." }));
      valid = false;
    }

    if (!valid) {
      setLoading(false);
      return;
    }

    const formData = new FormData(e.target);
    formData.append("tags", JSON.stringify(tags));

    if (images.file) {
      formData.append("image", images.file);
    } else if (FormButton === "Update" && images.preview) {
      formData.append("existingImage", images.preview);
    }

    let id = initialData?._id;

    try {
      const method = FormButton === "Submit" ? "post" : "patch";
      const endpoint =
        FormButton === "Submit"
          ? "/dashboard/PortfolioTab"
          : `/dashboard/updatePortfolio/${id}`;

      const response = await axios[method](endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({
        status: response.data.success ? "success" : "error",
        message: response.data.message,
      });

      if (response.data.success) {
        setTimeout(() => {
          setShowPortfolio(false);
          setInitialData(null);
          setTags([]);
          setFormButton("Submit");
          setImages({ file: null, preview: "" });
        }, 1000);
      }
    } catch (error) {
      setToast({
        status: "error",
        message:
          error.response?.data?.message ||
          "An error occurred while submitting the item.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = (record) => {
    setShowPortfolio(true);
    setFormButton("Update");
    setInitialData(record);
    setTags(JSON.parse(record.tags).map((tag) => tag.toLowerCase()));
    setImages({
      file: null,
      preview: record.image.toString(),
    });
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await axios.delete("/dashboard/deletePortfolio", {
        params: { id },
      });
      if (response.data.success) {
        setToast({
          status: "success",
          message: "Portfolio deleted successfully!",
        });
        setTimeout(() => {
          setProducts((prev) => prev.filter((item) => item._id !== id));
        }, 1000);
      }
    } catch (error) {
      setToast({ status: "error", message: "Failed to delete product" });
    }
  };

  return (
    <div className="p-5">
      <Loading visible={loading} />
      <Toast status={toast.status} message={toast.message} />
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Portfolio</h3>
        {!showPortfolio && (
          <button
            className="border px-2 py-1 text-white rounded-md bg-primary"
            onClick={() => setShowPortfolio(true)}
          >
            Add New
          </button>
        )}
        {showPortfolio && (
          <button
            className="border px-2 py-1 text-white rounded-md bg-rose-800"
            onClick={() => {
              setShowPortfolio(false);
              setInitialData(null);
              setTags([]);
              setFormButton("Submit");
              setImages({ file: null, preview: "" });
            }}
          >
            Cancel
          </button>
        )}
      </div>
      {showPortfolio && (
        <form onSubmit={handleSubmit} id="form">
          {/* Title and Price */}
          <div className="flex gap-5 mb-4">
            <div className="w-2/3">
              <label className="block text-gray-700 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Enter item title"
                maxLength={80}
                required
                defaultValue={initialData?.title || ""}
              />
            </div>
            <div className="w-1/3">
              <label className="block text-gray-700 font-medium mb-2">
                Price (Rs)
              </label>
              <input
                type="number"
                name="price"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Enter price"
                step="5"
                min={50}
                defaultValue={initialData?.price || ""}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Describe your item"
              maxLength={1000}
              rows="4"
              required
              defaultValue={initialData?.description || ""}
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Skills
            </label>
            <CreatableSelect
              isMulti
              options={tagsOption}
              className="basic-multi-select"
              classNamePrefix="select"
              value={tags.map((tag) => ({ value: tag, label: tag }))}
              onChange={(selectedOptions) => {
                if (!selectedOptions || selectedOptions.length <= 5) {
                  setTags(selectedOptions.map((option) => option.value));
                }
              }}
              onCreateOption={(inputValue) => {
                if (tags.length < 5) {
                  setTags((prev) => [...prev, inputValue.toLowerCase()]);
                }
              }}
            />
            {formErrors.tags && (
              <p className="text-red-600 text-sm mt-1">{formErrors.tags}</p>
            )}
          </div>

          {/* Images Section */}
          <div className="mb-4 mt-5">
            <label className="block text-gray-700 font-medium mb-2">
              Product Image
            </label>
            <div className="flex gap-2 flex-wrap">
              <div
                className="w-full border border-gray-300 rounded-lg cursor-pointer flex justify-center items-center bg-gray-100 relative h-36"
                onClick={() => document.getElementById("image-upload").click()}
              >
                {images.preview ? (
                  <>
                    <img
                      src={
                        images.preview?.includes("uploads")
                          ? `http://localhost:4400/${images.preview}`
                          : images.preview
                      }
                      alt="Portfolio"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      className="text-sm absolute top-0 right-2 bg-red-700 rounded-md p-2 mt-2"
                      onClick={handleDeleteImg}
                    >
                      <FaTrash className="text-white" />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <span className="text-4xl text-gray-400">+</span>
                    <span className="text-sm text-gray-500">Upload Image</span>
                  </label>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
            {formErrors.image && (
              <p className="text-red-600 text-sm mt-1">{formErrors.image}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-secondry text-white font-medium py-2 rounded-lg"
          >
            {FormButton}
          </button>
        </form>
      )}
      {!showPortfolio && (
        <div className="mt-4">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg border p-4 transition-shadow"
                >
                  <div className="relative">
                    <Link to={`/${product.username}/portfolio/${product._id}`}>
                      <button className="text-sm absolute top-0 right-20 bg-gray-400  rounded-full p-[0.5rem] mt-2">
                        <FaEye className="text-white text-md" />
                      </button>
                    </Link>
                    <button
                      className="text-sm absolute top-0 right-11 bg-primary  rounded-full p-[0.5rem] mt-2"
                      onClick={() => handleUpdateItem(product)}
                    >
                      <FaPen className="text-white text-md" />
                    </button>
                    <button className="text-sm absolute top-0 right-0 p-2">
                      <DeleteModal
                        handleDelete={() => handleDeleteItem(product._id)}
                      />
                    </button>
                  </div>
                  {product.image && (
                    <div>
                      <img
                        src={`http://localhost:4400/${product.image}`}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                    </div>
                  )}
                  <h4 className="text-lg font-semibold truncate">
                    {product.title}
                  </h4>
                  <p className="text-secondry font-medium">
                    Rs {product.price}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {product?.tags && JSON.parse(product?.tags).length > 0
                      ? JSON.parse(product?.tags || "[]").map(
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
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No portfolio items found. Add your first item by clicking Add New!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioTab;
