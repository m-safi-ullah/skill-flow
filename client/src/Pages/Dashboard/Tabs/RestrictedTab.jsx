import React from "react";
import { useNavigate } from "react-router-dom";

const RestrictedTab = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10  text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
        Access Restricted
      </h1>

      <p className="text-gray-700 text-md md:text-lg max-w-4xl">
        Your account has been restricted by the admin. As a result, access to
        your profile, products, and related services is temporarily disabled.
        <br />
        <br />
        Please contact support for further assistance or clarification.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md shadow"
      >
        Return to Home
      </button>
    </div>
  );
};

export default RestrictedTab;
