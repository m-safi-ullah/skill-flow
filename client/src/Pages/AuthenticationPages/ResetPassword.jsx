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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/auth/verify-email", email).then((response) => {
      console.log("Safi::", response);
    });
  };

  const verifyOTP = (e) => {
    setToast({
      status: "",
      message: "",
    });
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("email", email);
    axios.post("/auth/verify-otp", formData).then((response) => {
      if (response.data.success) {
        setFormVisibility("setPassword");
      } else {
        setToast({
          status: "error",
          message: response.data.message,
        });
      }
    });
  };

  const resetPassword = () => {};
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Enter your email"
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  required
                />

                <button
                  type="submit"
                  className="w-full button text-white font-medium py-2 rounded-lg focus:outline-none"
                >
                  {!btnLoader ? (
                    "Check Email"
                  ) : (
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </button>
              </form>
            )}

            {formVisibility === "verifyOTP" && (
              <form onSubmit={verifyOTP} className="form">
                <h2 className="text-2xl font-semibold  mb-2">
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
                  {!btnLoader ? (
                    "Verify OTP"
                  ) : (
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </button>
              </form>
            )}

            {formVisibility === "setPassword" && (
              <form onSubmit={resetPassword} className="form">
                <h2 className="text-2xl font-semibold  mb-2">
                  Set New Password
                </h2>
                <label className="block mb-2 font-medium">Enter password</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter your OTP"
                  className="w-full p-2 focus:outline-none border border-gray-300 rounded mb-4"
                  required
                />

                <label className="block mb-2 font-medium">
                  Enter confirm password
                </label>
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
                  {!btnLoader ? (
                    "Reset Password"
                  ) : (
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    </div>
                  )}
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
