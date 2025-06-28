import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import axios from "../../../baseURL/axios";
import Toast from "../../../Symbols/Toast";
import Loading from "../../../Symbols/Loading";
import { FaTrash } from "react-icons/fa";
import { SkillsArray } from "../../../Symbols/SkillsArray";
import GemeniProductDescription from "../../utils/GemeniProductDescription";
import { Editor } from "@tinymce/tinymce-react";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [toast, setToast] = useState({ status: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [FormButton, setFormButton] = useState("Submit");
  const [formErrors, setFormErrors] = useState({ price: "", tags: "" });
  const [deletedServerImages, setDeletedServerImages] = useState([]);
  const [spinnerGenerator, setSpinnerGenerator] = useState(false);
  const [isFile, setIsFile] = useState(false);
  const [description, setDescription] = useState("");

  const [images, setImages] = useState(
    Array(4).fill({ file: null, preview: "" })
  );

  const [initialData, setInitialData] = useState(null);

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
            setIsFile(product?.isFile);

            const productImages = Array(4).fill({ file: null, preview: "" });
            product.image?.forEach((img, idx) => {
              if (idx < 4) {
                productImages[idx] = { file: null, preview: img };
              }
            });
            setImages(productImages);
            setDescription(product.description || "");
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
    formData.append("description", description);
    formData.append("isFile", isFile);

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
        navigate("/dashboard?tab=product-list");
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

  const handleGenerateDescription = async (e) => {
    e.preventDefault();
    setSpinnerGenerator(true);

    const form = document.getElementById("form");
    const titleInput = form.elements["title"];
    const title = titleInput?.value;

    if (!title) {
      setSpinnerGenerator(false);
      setToast({
        status: "error",
        message: "Please enter a title before generating a description.",
      });
      return;
    }

    const { success, description: generatedDescription } =
      await GemeniProductDescription(title);

    if (success) {
      const html = marked.parse(generatedDescription);
      setDescription(html);
    } else {
      setToast({
        status: "error",
        message: "Failed to generate description.",
      });
    }

    setSpinnerGenerator(false);
  };

  return (
    <div className="p-5">
      <Loading visible={loading} />
      <Toast status={toast.status} message={toast.message} />
      <form onSubmit={handleSubmit} id="form">
        <h3 className="text-xl font-medium mb-4">Create Product</h3>

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
        <div className="flex gap-5 mb-4">
          <div className="w-2/3">
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
          <div className="w-1/3">
            <label className="block text-gray-700 font-medium mb-2">
              Product is physical or file
            </label>
            <div className="mt-5 gap-5 flex ">
              <p
                className={` p-2 rounded-md cursor-pointer ${
                  isFile ? "" : "bg-cyan-100"
                }`}
                onClick={() => {
                  setIsFile(false);
                }}
              >
                Physical
              </p>
              <p
                className={` p-2 rounded-md cursor-pointer ${
                  isFile ? "bg-cyan-100" : ""
                }`}
                onClick={() => {
                  setIsFile(true);
                }}
              >
                File
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4 ">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>

          <div className="flex gap-2 relative">
            {/* <textarea
              name="description"
              className="w-full border border-gray-300 inline-block rounded-lg px-4 py-2"
              placeholder="Describe your item"
              maxLength={1500}
              rows="8"
              required
              defaultValue={initialData?.description || ""}
            /> */}

            <Editor
              apiKey="wzc0onj4cmy60vu6ruloh32bfhw7mt528igrr8trewn2ss4m"
              value={description}
              onEditorChange={(newValue) => setDescription(newValue)}
              init={{
                height: 400,
                width: "100%",
                menubar: false,
                icons: "default",
                plugins: [
                  "advlist autolink lists link charmap preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste help wordcount",
                  "code",
                ],
                toolbar:
                  "undo redo | blocks fontsize | code | bold italic underline strikethrough",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:17px }",
              }}
            />

            <button
              className="z-10 flex items-center border rounded-md px-3 py-2 text-sm bg-primary hover:bg-secondry text-white absolute right-2 top-2 gap-2 disabled:opacity-60"
              onClick={handleGenerateDescription}
              disabled={spinnerGenerator}
            >
              {spinnerGenerator && (
                <svg
                  className="w-4 h-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              <span>
                {spinnerGenerator ? "Generating..." : "Generate Description"}
              </span>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <CreatableSelect
            isMulti
            options={SkillsArray}
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
            readOnly={tags.length >= 5}
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
