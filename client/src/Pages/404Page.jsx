import React from "react";
import img1 from "../images/NotFoundPage-Img1.png"; // Ralph face
import img2 from "../images/NotFoundPage-Img2.jpg"; // KnowsMore
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      {/* 404 */}
      <div className="text-[7rem] font-extrabold text-black leading-none flex items-center justify-center space-x-4">
        <span>4</span>
        <img
          src={img1}
          alt="Ralph"
          className="w-24 h-2- object-contain rounded-full  animate-bounce"
        />
        <span>4</span>
      </div>

      {/* Message */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
        You didn’t break the internet,
        <br />
        but we can’t find what you are looking for.
      </h2>

      {/* Search prompt */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
        <img src={img2} alt="KnowsMore" className="w-24 h-24 object-contain" />
        <div className="text-left">
          <p className="text-sm mb-1 text-gray-700 font-medium">
            What can Knows More help you find today?
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium rounded-md shadow-md"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
