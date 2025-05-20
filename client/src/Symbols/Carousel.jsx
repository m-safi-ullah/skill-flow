import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative w-full bg-gray-800 rounded-lg overflow-hidden">
      <div className="relative h-56 md:h-96">
        <div
          className="absolute w-full h-full transition-opacity duration-700 ease-in-out"
          style={{
            opacity: currentIndex === 0 ? 1 : 0,
          }}
        >
          <img
            src={`http://localhost:4400/${images[0]}`}
            alt="carousel-item-1"
            className="w-full h-full object-cover"
          />
        </div>
        {images.slice(1).map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
              currentIndex === index + 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={`http://localhost:4400/${images[index + 1]}`}
              alt={`carousel-item-${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Slider controls */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevImage}
            className="absolute top-1/2 left-4 z-30 flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full hover:bg-gray-700 focus:outline-none"
          >
            <FaChevronLeft className="w-4 h-4 text-white" />
          </button>

          <button
            type="button"
            onClick={nextImage}
            className="absolute top-1/2 right-4 z-30 flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full hover:bg-gray-700 focus:outline-none"
          >
            <FaChevronRight className="w-4 h-4 text-white" />
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;
