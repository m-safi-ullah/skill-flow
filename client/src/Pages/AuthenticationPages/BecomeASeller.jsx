import React, { useEffect, useState } from "react";
import signin from "../../images/singIn.png";
import { Link } from "react-router-dom";
import Toast from "../../Symbols/Toast";
import useAxios from "../../baseURL/axios";
import { useCookies } from "react-cookie";

const BecomeASeller = () => {
  const axios = useAxios();
  const [toast, setToast] = useState({ status: "", message: "" });
  const [btnLoader, setBtnLoader] = useState(false);
  const [attachedCnic, setAttachedCnic] = useState(null);
  const [formVisibility, setFormVisibility] = useState(true);
  const [cnic, setCnic] = useState("");
  const [email, setEmail] = useState("");
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token) {
      window.location.href = "/dashboard";
    }
  }, [cookies.token]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setToast({ status: "", message: "" });

    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setToast({
        status: "error",
        message: "Password and confirm password must match",
      });
    } else {
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
                >
                  {!btnLoader ? (
                    "Become A Seller"
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

export default BecomeASeller;
