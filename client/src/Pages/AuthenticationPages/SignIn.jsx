import { useContext, useEffect, useState } from "react";
import signin from "../../images/singIn.png";
import { Link } from "react-router";
import Toast from "../../Symbols/Toast";
import axios from "../../baseURL/axios";
import "../../css/Auth.css";
import { useCookies } from "react-cookie";
import { GlobalContext } from "../context/context";

const SignIn = () => {
  const [toast, setToast] = useState({ status: "", message: "" });
  const [btnLoader, setbtnLoader] = useState(false);
  const [portal, setPortal] = useState("seller");
  const [cookies] = useCookies(["token"]);
  const { setRestricted } = useContext(GlobalContext);

  useEffect(() => {
    if (cookies.token) {
      window.location.href = "/dashboard";
    }
  }, [cookies.token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setToast({ status: "", message: "" });
    setbtnLoader(true);
    formData.append("role", portal);
    axios
      .post("/auth/signIn", formData)
      .then((response) => {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirectUrl");
        if (response.data.success) {
          if (redirectUrl) {
            setRestricted(response.data.restricted);
            window.location.href = decodeURIComponent(redirectUrl);
          } else window.location.href = "/dashboard";
        } else {
          setbtnLoader(false);
          setToast({
            status: "error",
            message: "Sign In Failed, Please check your credentials",
          });
        }
      })
      .catch((error) => {
        setbtnLoader(false);
        setToast({
          status: "error",
          message: error,
        });
      });
  };

  return (
    <div className="m-5">
      <Toast status={toast.status} message={toast.message} />
      <div className="mx-auto auth-main shadow-md bg-white p-8 lg:w-[80%] w-[100%] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="hidden md:block m-auto">
            <img src={signin} alt="Sign In" className="w-full" />
          </div>
          <div className="my-auto">
            <form onSubmit={handleSubmit} className="form">
              <h2 className="text-2xl font-semibold mb-2">
                Sign in to your account
              </h2>
              <p className="mb-4 text-gray-600">
                Don’t have an account?{" "}
                <Link to="/sign-up" className="underline">
                  Join
                </Link>
              </p>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4 ">
                <label className="block text-gray-700 font-medium mb-2">
                  Select Portal
                </label>
                <div className="flex portal">
                  <p
                    className={`cursor-pointer px-4 py-2 rounded-lg ${
                      portal === "seller" ? "active" : ""
                    }`}
                    onClick={() => setPortal("seller")}
                  >
                    Seller
                  </p>
                  <p
                    className={`cursor-pointer px-4 py-2 rounded-lg ${
                      portal === "buyer" ? "active" : ""
                    }`}
                    onClick={() => setPortal("buyer")}
                  >
                    Buyer
                  </p>
                  <p
                    className={`cursor-pointer px-4 py-2 rounded-lg ${
                      portal === "admin" ? "active" : ""
                    }`}
                    onClick={() => setPortal("admin")}
                  >
                    Admin
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="w-full button text-white font-medium py-2 rounded-lg focus:outline-none"
              >
                {!btnLoader ? (
                  "Sign In"
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
              <p className="text-gray-600 mt-4">
                Having trouble logging in?{" "}
                <Link to="/reset-password" className="underline">
                  Reset password
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
