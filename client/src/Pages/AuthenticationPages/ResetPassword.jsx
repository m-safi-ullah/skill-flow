import React, { useState } from "react";
import useAxios from "../../baseURL/axios";
import signin from "../../images/singIn.png";
import Toast from "../../Symbols/Toast";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const axios = useAxios();
  const [toast, setToast] = useState({ status: "", message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [formVisibility, setFormVisibility] = useState("verifyEmail");
  const [email, setEmail] = useState("");
  const [portal, setPortal] = useState("seller");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ status: "", message: "" });

    axios
      .post("/auth/verify-email", { email, role: portal })
      .then((response) => {
        if (response.data.success) {
          setToast({ status: "success", message: "OTP sent to your email" });
          setFormVisibility("verifyOTP");
        } else {
          setToast({ status: "error", message: response.data.message });
        }
      });
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    setToast({ status: "", message: "" });

    const formData = new FormData(e.target);
    formData.append("email", email);

    axios.post("/auth/verify-otp", formData).then((response) => {
      if (response.data.success) {
        setToast({ status: "success", message: "OTP verified successfully" });
        setFormVisibility("setPassword");
      } else {
        setToast({ status: "error", message: response.data.message });
      }
    });
  };

  // Password validation function (Updated to match BecomeASeller)
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

  const resetPassword = (e) => {
    e.preventDefault();
    setToast({ status: "", message: "" });
    setPasswordError("");

    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validate password strength and matching
    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    formData.append("email", email);
    formData.append("role", portal);

    axios.post("/auth/reset-password", formData).then((response) => {
      if (response.data.success) {
        setToast({ status: "success", message: "Password reset successfully" });
        window.location.href = "/dashboard";
      } else {
        setToast({ status: "error", message: response.data.message });
      }
    });
  };

  return (
    <div className="m-5">
      <Toast status={toast.status} message={toast.message} />
      <div className="mx-auto auth-main shadow-md bg-white p-8 rounded-lg sm:w-[80%] w-[100%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="hidden sm:block">
            <img src={signin} alt="Sign in" className="w-full h-auto" />
          </div>
          <div className="my-auto">
            {formVisibility === "verifyEmail" && (
              <form onSubmit={handleSubmit} className="form">
                <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  required
                />
                <button
                  type="submit"
                  className="w-full button text-white font-medium py-2 rounded-lg focus:outline-none"
                >
                  {!btnLoader ? "Check Email" : "Processing..."}
                </button>
              </form>
            )}

            {formVisibility === "verifyOTP" && (
              <form onSubmit={verifyOTP} className="form">
                <h2 className="text-2xl font-semibold mb-2">
                  Verify your account
                </h2>
                <label className="block mb-2 font-medium">Enter OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  required
                />
                <button
                  type="submit"
                  className="w-full button text-white font-medium py-2 rounded-lg focus:outline-none"
                >
                  {!btnLoader ? "Verify OTP" : "Processing..."}
                </button>
              </form>
            )}

            {formVisibility === "setPassword" && (
              <form onSubmit={resetPassword} className="form">
                <h2 className="text-2xl font-semibold mb-2">
                  Set New Password
                </h2>
                <label className="block mb-2 font-medium">Enter Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  required
                />
                <label className="block mb-2 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Enter confirm password"
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  required
                />

                {passwordError && (
                  <div className="text-red-500 text-sm mb-4">
                    {passwordError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full button text-white font-medium py-2 rounded-lg focus:outline-none"
                >
                  {!btnLoader ? "Reset Password" : "Processing..."}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
