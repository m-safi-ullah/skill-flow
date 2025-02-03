import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/context.jsx";
import defaultProfilePic from "../../../images/defaultProfilePic.png";

const DashboardTab = () => {
  const { authEmail, authName } = useContext(GlobalContext);
  return (
    <div className="flex flex-wrap gap-5">
      {/* Profile */}
      <div className="bg-white shadow-lg rounded-lg p-6 lg:w-[calc(50%-0.75rem)] w-[100%] relative">
        <Link to="/dashboard?tab=profile">
          <span className="material-symbols-outlined text-green-600 absolute top-2 right-2">
            edit_square
          </span>
        </Link>
        <div className="flex items-center">
          <img
            src={defaultProfilePic}
            alt="Profile Picture"
            className="w-20 h-20 rounded-full"
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{authName}</h2>
            <p className="text-gray-500 text-sm mb-2">{authEmail}</p>
            <p className="text-sm text-gray-600">Pakistan</p>
          </div>
        </div>
        <div className="mt-4 border-t pt-4">
          <h3 className="text-md font-medium">
            Your WordPress and Shopify Expert
          </h3>
          <p className="mt-2 text-gray-700 text-sm">
            🚀 4+ Years of Web Development Experience 🏅 Level 1 Seller on
            Fiverr 🏆 Top 10% in WordPress and Shopify Development 💎 Worked
            with 50+ brands
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
