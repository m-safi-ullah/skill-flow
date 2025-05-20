import React from "react";

const services = [
  {
    title: "Painter",
    description:
      "Experienced home and commercial painters for interior and exterior projects.",
    icon: "🎨",
  },
  {
    title: "Cake Maker",
    description:
      "Custom cakes and baked goods for birthdays, weddings, and events.",
    icon: "🍰",
  },
  {
    title: "Mechanic",
    description:
      "Reliable repair and maintenance services for cars, bikes, and small engines.",
    icon: "🔧",
  },
  {
    title: "Plumber",
    description:
      "Skilled in fixing leaks, installing fixtures, and managing water systems.",
    icon: "🚿",
  },
  {
    title: "Electrician",
    description:
      "Certified electricians for wiring, lighting installation, and repairs.",
    icon: "💡",
  },
  {
    title: "Tailor",
    description:
      "Custom clothing alterations and stitching for men, women, and kids.",
    icon: "🧵",
  },
];

const Service = () => {
  return (
    <div className="min-h-screen bg-sky-50 py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-sky-800 mb-12">
          Our Services
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 text-center"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h2 className="text-xl font-semibold text-sky-700 mb-2">
                {service.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
