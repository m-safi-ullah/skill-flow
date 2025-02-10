import React, { useContext, useState } from "react";
import CreatableSelect from "react-select/creatable";
import useAxios from "../../../baseURL/axios";
import Toast from "../../../Symbols/Toast";
import Loading from "../../../Symbols/Loading";
import { GlobalContext } from "../../context/context";

const CreateProduct = () => {
  const [tags, setTags] = useState([]);
  const [toast, setToast] = useState({ status: "", message: "" });
  const [loading, setLoading] = useState(false);
  const axios = useAxios();

  const [options] = useState([
    { value: "furniture", label: "Furniture" },
    { value: "electronics", label: "Electronics" },
  ]);
  const [images, setImages] = useState({
    image1: { file: null, preview: "" },
    image2: { file: null, preview: "" },
    image3: { file: null, preview: "" },
    image4: { file: null, preview: "" },
  });
  const { authEmail, authRole } = useContext(GlobalContext);

  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImages((prev) => ({
        ...prev,
        [imageKey]: { file, preview },
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ status: "", message: "" });

    // Form validation
    const title = e.target.title.value.trim();
    const price = parseFloat(e.target.price.value);
    const description = e.target.description.value.trim();

    if (price <= 0) {
      setToast({ status: "error", message: "Price must be greater than 0." });
      setLoading(false);
      return;
    }

    if (tags.length === 0) {
      setToast({ status: "error", message: "Please add at least one tag." });
      setLoading(false);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("email", authEmail);
    formData.append("role", authRole);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));

    // Append images if they exist
    Object.values(images).forEach((image, index) => {
      if (image.file) {
        formData.append(`image${index + 1}`, image.file);
      }
    });

    try {
      const response = await axios.post("/dashboard/create-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setToast({ status: "success", message: "Item created successfully!" });
        // Reset form after successful submission
        e.target.reset();
        setTags([]);
        setImages({
          image1: { file: null, preview: "" },
          image2: { file: null, preview: "" },
          image3: { file: null, preview: "" },
          image4: { file: null, preview: "" },
        });
      } else {
        setToast({ status: "error", message: response.data.message });
      }
    } catch (error) {
      console.error("Error submitting item:", error);
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
      <form onSubmit={handleSubmit} className="">
        <h3 className="text-xl font-medium mb-4">Product Information</h3>

        {/* Images Section */}
        <div className="mb-4 mt-5">
          <label className="block text-gray-700 font-medium mb-2">
            Product Images
          </label>
          <div className="flex gap-4 flex-wrap">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="w-48">
                <div
                  className="p-2 border border-gray-300 rounded-lg cursor-pointer flex justify-center items-center w-full h-32 bg-gray-100 relative"
                  onClick={() =>
                    document.getElementById(`fileInput${num}`).click()
                  }
                >
                  {images[`image${num}`]?.preview ? (
                    <img
                      src={images[`image${num}`].preview}
                      alt={`Preview ${num}`}
                      className="w-full h-full"
                      style={{ borderRadius: "0.3rem", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-4xl text-gray-400">+</span>
                      <span className="text-sm text-gray-500">
                        Upload Image
                      </span>
                    </div>
                  )}
                  <input
                    id={`fileInput${num}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, `image${num}`)}
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
              required
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
            rows="4"
            required
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <CreatableSelect
            isMulti
            name="tags"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            value={tags.map((tag) => ({ value: tag, label: tag }))}
            onChange={(selectedOptions) => {
              setTags(selectedOptions.map((option) => option.value));
            }}
            onCreateOption={(inputValue) => {
              const newOption = {
                value: inputValue.toLowerCase(),
                label: inputValue,
              };
              setTags((prev) => [...prev, newOption.value]);
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-secondry text-white font-medium py-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
