import React, { useEffect, useState } from "react";
import Toast from "../../../Symbols/Toast";
import useAxios from "../../../baseURL/axios";

const CreateAdminTab = () => {
  const axios = useAxios();
  const [toast, setToast] = useState({ status: "", message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [attachedCnic, setAttachedCnic] = useState(null);
  const [formVisibility, setFormVisibility] = useState(true);
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cnicError, setCnicError] = useState("");

  const handleChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "");

    if (value.length > 5 && value.length <= 12) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    } else if (value.length > 12) {
      value = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(
        12,
        13
      )}`;
    }
    setCnic(value);

    if (value.length !== 15) {
      setCnicError("CNIC must be in the format 12345-1234567-1.");
    } else {
      setCnicError("");
    }
  };

  const handleCnicImage = (e) => {
    setAttachedCnic(e.target.files[0]);
  };

  // Password validation function
  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Password and confirm password must match.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must include at least one lowercase letter.";
    }

    if (!/\d/.test(password)) {
      return "Password must include at least one number.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must include at least one special character.";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ status: "", message: "" });
    setPasswordError("");

    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validate password
    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    // Validate CNIC format
    if (cnic.length !== 15) {
      setCnicError("CNIC must be in the format 12345-1234567-1.");
      return;
    }

    setBtnLoader(true);
    formData.delete("confirmPassword");
    const email = formData.get("email");
    setEmail(email);
    formData.append("attachCnic", attachedCnic);

    axios
      .post("/auth/admin-register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data.success) {
          setFormVisibility(false);
          setToast({ status: "success", message: "OTP sent to your email" });
        } else {
          setToast({ status: "error", message: response.data.message });
        }
      })
      .finally(() => setBtnLoader(false));
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    setToast({ status: "", message: "" });

    const formData = new FormData(e.target);
    formData.append("email", email);

    axios.post("/auth/verify-otp", formData).then((response) => {
      if (response.data.success) {
        setToast({ status: "success", message: response.data.message });
        window.location.reload();
      } else {
        setToast({ status: "error", message: response.data.message });
      }
    });
  };

  return (
    <div>
      <Toast status={toast.status} message={toast.message} />

      <div className="my-auto">
        {formVisibility && (
          <form onSubmit={handleSubmit} className="m-5">
            <h3 className="text-xl font-medium mb-5">Add New Admin</h3>

            <label className="block mb-2 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="w-full p-2 border focus:outline-none border-gray-300 rounded mb-4"
              required
            />

            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-2 border focus:outline-none border-gray-300 rounded mb-4"
              required
            />

            <label className="block mb-2 font-medium">CNIC</label>
            <input
              type="text"
              name="cnic"
              value={cnic}
              onChange={handleChange}
              maxLength="15"
              className="w-full p-2 border focus:outline-none border-gray-300 rounded mb-4"
              placeholder="12345-1234567-1"
              required
            />
            {cnicError && (
              <div className="text-red-500 text-sm mb-4">{cnicError}</div>
            )}

            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="w-full p-2 border focus:outline-none border-gray-300 rounded mb-4"
              required
            />

            <label className="block mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Enter confirm password"
              className="w-full p-2 border focus:outline-none border-gray-300 rounded mb-4"
              required
            />
            {passwordError && (
              <div className="text-red-500 text-sm mb-4">{passwordError}</div>
            )}

            <label className="block mb-2 font-medium">Upload CNIC</label>
            <input
              className="w-full p-2 border border-gray-300 rounded mb-4"
              type="file"
              onChange={handleCnicImage}
              required
            />

            <button
              type="submit"
              className="w-full button text-white font-medium py-2 rounded-lg focus:outline-none"
              disabled={btnLoader}
            >
              {!btnLoader ? "Submit" : "Processing..."}
            </button>
          </form>
        )}

        {!formVisibility && (
          <form onSubmit={verifyOTP} className="form">
            <h2 className="text-2xl font-semibold mb-2">Verify your account</h2>
            <label className="block mb-2 font-medium">Enter OTP</label>
            <input
              type="text"
              name="otp"
              placeholder="Enter your OTP"
              className="w-full p-2 border focus:outline-none border-gray-300 rounded mb-4"
              required
            />
            <button
              type="submit"
              className="w-full button text-white font-medium py-2 rounded-lg focus:outline-none"
              disabled={btnLoader}
            >
              {!btnLoader ? "Verify OTP" : "Processing..."}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateAdminTab;
