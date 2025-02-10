import React, { useState, useEffect } from "react";
import signin from "../../images/singIn.png";
import { Link } from "react-router-dom";
import useAxios from "../../baseURL/axios";
import Toast from "../../Symbols/Toast";
import "../../css/Auth.css";
import { useCookies } from "react-cookie";

const SignUp = () => {
  const axios = useAxios();
  const [toast, setToast] = useState({ status: "", message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [formVisibility, setFormVisibility] = useState(true);
  const [email, setEmail] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token) {
      window.location.href = "/dashboard";
    }
  }, [cookies.token]);

  // Password validation function (Updated to match BecomeASeller and ResetPassword)
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

    setBtnLoader(true);
    formData.delete("confirmPassword");
    const email = formData.get("email");
    setEmail(email);

    axios.post("/auth/register", formData).then((response) => {
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
    e.preventDefault();
    setToast({ status: "", message: "" });

    const formData = new FormData(e.target);
    formData.append("email", email);

    axios.post("/auth/verify-otp", formData).then((response) => {
      if (response.data.success) {
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
      <div className="mx-auto auth-main shadow-md bg-white p-8 rounded-lg lg:w-[80%] w-[100%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="hidden md:block m-auto">
            <img src={signin} alt="Sign in" className="w-full h-auto" />
          </div>
          <div className="my-auto">
            {formVisibility && (
              <form onSubmit={handleSubmit} className="form">
                <h2 className="text-2xl font-semibold mb-2">
                  Create a new account
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
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  required
                />

                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  required
                />

                <label className="block mb-2 font-medium">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  required
                />

                <label className="block mb-2 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Enter confirm password"
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  name="confirmPassword"
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
                  disabled={btnLoader}
                >
                  {!btnLoader ? "Sign Up" : "Processing..."}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
