import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "../../../baseURL/axios";
import Toast from "../../../Symbols/Toast";
import Loading from "../../../Symbols/Loading";
import { FaTrash } from "react-icons/fa";
import { SkillsArray } from "../../../Symbols/SkillsArray";

const CreateProduct = () => {
  const [tags, setTags] = useState([]);
  const [toast, setToast] = useState({ status: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [FormButton, setFormButton] = useState("Submit");
  const [formErrors, setFormErrors] = useState({ price: "", tags: "" });
  const [deletedServerImages, setDeletedServerImages] = useState([]);

  const [images, setImages] = useState(
    Array(4).fill({ file: null, preview: "" })
  );

  const [initialData, setInitialData] = useState(null);

  const tagsOption = SkillsArray;

  useEffect(() => {
    if (location.search.includes("&")) {
      const id = location.search?.split("&")[1].split("=")[1];
      const fetchProduct = async () => {
        setFormButton("Update");
        try {
          const response = await axios.get("/dashboard/getProductById", {
            params: { id },
          });
          if (response.data.success) {
            const { product } = response.data;
            setInitialData(product);
            setTags(JSON.parse(product?.tags) || []);
            const productImages = Array(4).fill({ file: null, preview: "" });
            product.image?.forEach((img, idx) => {
              if (idx < 4) {
                productImages[idx] = { file: null, preview: img };
              }
            });
            setImages(productImages);
          }
        } catch (error) {
          setToast({
            status: "error",
            message: "Failed to fetch product details",
          });
        }
      };
      fetchProduct();
    }
  }, [location]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...images];

      const oldImage = updatedImages[index];
      if (
        oldImage.preview &&
        oldImage.preview.includes("uploads") &&
        !oldImage.file
      ) {
        setDeletedServerImages((prev) => [...prev, oldImage.preview]);
      }

      updatedImages[index] = {
        file,
        preview: URL.createObjectURL(file),
      };

      setImages(updatedImages);
    }
    e.target.value = "";
  };

  const handleDeleteImg = (index, e) => {
    e.stopPropagation();
    const updatedImages = [...images];

    const deletedImage = updatedImages[index];
    if (
      deletedImage.preview &&
      deletedImage.preview.includes("uploads") &&
      !deletedImage.file
    ) {
      setDeletedServerImages((prev) => [...prev, deletedImage.preview]);
    }

    updatedImages[index] = { file: null, preview: "" };
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ status: "", message: "" });
    setFormErrors({ price: "", tags: "" });

    let hasError = false;

    if (tags.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        tags: "Please add at least one tag.",
      }));
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    const formData = new FormData(e.target);
    formData.append("tags", JSON.stringify(tags));

    images.forEach((imageObj) => {
      if (imageObj.file) {
        formData.append("images[]", imageObj.file);
      }
    });

    if (FormButton === "Update") {
      var id = location?.search?.split("&")[1].split("=")[1];
      formData.append("deletedImages", JSON.stringify(deletedServerImages));
    }

    try {
      const url =
        FormButton === "Submit"
          ? "/dashboard/createProduct"
          : `/dashboard/updateProduct/${id}`;
      const method = FormButton === "Submit" ? "post" : "patch";

      const response = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({
        status: response.data.success ? "success" : "error",
        message: response.data.message,
      });

      if (response.data.success) {
        window.location.href = "/dashboard?tab=product-list";
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

  return (
    <div className="p-5">
      <Loading visible={loading} />
      <Toast status={toast.status} message={toast.message} />
      <form onSubmit={handleSubmit} id="form">
        <h3 className="text-xl font-medium mb-4">Product Information</h3>

        {/* Images Section */}
        <div className="mb-4 mt-5">
          <label className="block text-gray-700 font-medium mb-2">
            Product Images
          </label>
          <div className="flex gap-2 flex-wrap">
            {images.map((image, idx) => (
              <div key={idx} className="w-56">
                <div
                  className="border border-gray-300 rounded-lg cursor-pointer flex justify-center items-center w-full h-36 bg-gray-100 relative"
                  onClick={() =>
                    document.getElementById(`fileInput${idx + 1}`).click()
                  }
                >
                  {image.preview ? (
                    <>
                      <img
                        src={
                          image.preview?.includes("uploads")
                            ? `http://localhost:4400/${image.preview}`
                            : image.preview
                        }
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        className="text-sm absolute top-0 right-2 bg-red-700 rounded-md p-2 mt-2"
                        onClick={(e) => handleDeleteImg(idx, e)}
                      >
                        <FaTrash className="text-white" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-4xl text-gray-400">+</span>
                      <span className="text-sm text-gray-500">
                        Upload Image
                      </span>
                    </div>
                  )}
                  <input
                    id={`fileInput${idx + 1}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, idx)}
                    className="hidden"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

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
            {formErrors.price && (
              <p className="text-red-600 text-sm mt-1">{formErrors.price}</p>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Short Description
          </label>
          <textarea
            name="shortDescription"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Share important points"
            maxLength={120}
            rows="2"
            required
            defaultValue={initialData?.shortDescription || ""}
          />
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
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <CreatableSelect
            isMulti
            options={tagsOption}
            className="basic-multi-select"
            classNamePrefix="select"
            value={tags.map((tag) => ({ value: tag, label: tag }))}
            onChange={(selectedOptions) => {
              setTags(selectedOptions.map((option) => option.value));
            }}
            onCreateOption={(inputValue) =>
              setTags((prev) => [...prev, inputValue.toLowerCase()])
            }
          />
          {formErrors.tags && (
            <p className="text-red-600 text-sm mt-1">{formErrors.tags}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-secondry text-white font-medium py-2 rounded-lg"
        >
          {FormButton}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
