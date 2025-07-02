import React, { useEffect, useState, useContext } from "react";
import signin from "../../images/singIn.png";
import { Link } from "react-router-dom";
import Toast from "../../Symbols/Toast";
import axios from "../../baseURL/axios";
import { useNavigate } from "react-router-dom";

const BecomeASeller = () => {
  const [toast, setToast] = useState({ status: "", message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [attachedCnic, setAttachedCnic] = useState(null);
  const [formVisibility, setFormVisibility] = useState(true);
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authentication") === "true";
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [localStorage.getItem("authentication")]);

  const handleChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");

    if (value.length > 5 && value.length <= 12) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    } else if (value.length > 12) {
      value = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(
        12,
        13
      )}`;
    }
    setCnic(value);
  };

  const handleCnicImage = (e) => {
    setAttachedCnic(e.target.files[0]);
  };

  // Password validation function
  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Password and confirm password must match";
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
    const formData = new FormData(e.target);

    setToast({ status: "", message: "" });

    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const validationError = validatePassword(password, confirmPassword);

    if (validationError) {
      setPasswordError(validationError);
      return;
    }
    setPasswordError("");
    setBtnLoader(true);
    formData.delete("confirmPassword");
    const email = formData.get("email");
    setEmail(email);
    formData.append("attachCnic", attachedCnic);

    axios
      .post("/auth/seller-register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        if (response.data.success) {
          setFormVisibility(false);
          setToast({
            status: "success",
            message: "OTP sent to your email",
          });
          setBtnLoader(false);
        } else {
          setBtnLoader(false);
          setToast({
            status: "error",
            message: response.data.message,
          });
        }
      });
  };

  const verifyOTP = (e) => {
    setToast({ status: "", message: "" });
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("email", email);
    axios.post("/auth/verify-otp", formData).then((response) => {
      if (response.data.success) {
        localStorage.setItem("authentication", "true");
        window.location.href = "/dashboard";
      } else {
        setToast({
          status: "error",
          message: response.data.message,
        });
      }
    });
  };

  return (
    <div className="m-5">
      <Toast status={toast.status} message={toast.message} />
      <div className="container mx-auto auth-main shadow-lg p-8 lg:w-[80%] w-[100%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="hidden md:block m-auto">
            <img src={signin} alt="Sign in" className="w-full h-auto" />
          </div>
          <div className="my-auto">
            {formVisibility && (
              <form onSubmit={handleSubmit} className="form">
                <h2 className="text-2xl font-semibold  mb-2">
                  Create a seller account
                </h2>
                <p className="mb-4 text-gray-600">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="underline">
                    Sign in
                  </Link>
                </p>

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
                  className="w-full p-2 border focus:outline-none border-gray-300 rounded mb-4"
                  onChange={handleChange}
                  maxLength="15"
                  minLength="15"
                  placeholder="12345-1234567-1"
                  required
                />

                <label className="block mb-2 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full p-2 border focus:outline-none border-gray-300 rounded mb-4"
                  required
                />

                <label className="block mb-2 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Enter confirm password"
                  className="w-full p-2 border focus:outline-none border-gray-300 rounded mb-4"
                  required
                />

                {passwordError && (
                  <div className="text-red-500 text-sm mb-4">
                    {passwordError}
                  </div>
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
                  {!btnLoader ? "Become A Seller" : "Processing..."}
                </button>
              </form>
            )}

            {!formVisibility && (
              <form onSubmit={verifyOTP} className="form">
                <h2 className="text-2xl font-semibold mb-2">
                  Verify your account
                </h2>
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
                  className="w-full button text-white font-medium py-2 rounded-lg"
                >
                  Verify OTP
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeASeller;
