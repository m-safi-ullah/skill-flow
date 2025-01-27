import React, { useState, useEffect } from "react";
import signin from "../../images/singIn.png";
import { Link } from "react-router";
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
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token) {
      window.location.href = "/dashboard";
    }
  }, [cookies.token]);

  const handleSubmit = (e) => {
    setToast({
      status: "",
      message: "",
    });
    e.preventDefault();
    const formData = new FormData(e.target);

    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password != confirmPassword) {
      setToast({
        status: "error",
        message: "Password and confirm password must match",
      });
    } else {
      setBtnLoader(true);
      formData.delete("confirmPassword");
      const email = formData.get("email");
      setEmail(email);
      axios.post("/auth/register", formData).then((response) => {
        if (response.data.success) {
          setFormVisibility(false);
          setToast({
            status: "success",
            message: "OTP send to your email",
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
    }
  };

  const verifyOTP = (e) => {
    setToast({
      status: "",
      message: "",
    });
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("email", email);
    axios.post("/auth/verifyOtp", formData).then((response) => {
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
      <div className="mx-auto auth-main shadow-md bg-white p-8 rounded-lg sm:w-[80%] w-[100%]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="hidden sm:block">
            <img src={signin} alt="Sign in" className="w-full h-auto" />
          </div>
          <div>
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

                <button
                  type="submit"
                  className="w-full button text-white font-medium py-2 rounded-lg focus:outline-none"
                >
                  {!btnLoader ? (
                    "Sign Up"
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

            {!formVisibility && (
              <form onSubmit={verifyOTP}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
