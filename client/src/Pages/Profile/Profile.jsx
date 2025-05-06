import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const SellerProfile = (portal) => {
  const location = useLocation();

  useEffect(() => {
    const name = location.pathname.split("/")[2];

    axios.get("/profile/getProfile", {
      params: { name, portal },
    });
  }, [window.location.pathname]);
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6 border-b pb-6">
        <img
          src="/images/avatar.png"
          alt="Seller"
          className="w-28 h-28 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-2xl font-bold">M Safi Ullah</h1>
          <p className="text-gray-600">@ex_wordprcss</p>
          <p className="text-sm text-gray-500 mt-1">
            📍 Pakistan · Speaks English, German, Chinese, Spanish
          </p>
          <p className="text-sm text-blue-600 mt-1">Level 1 Seller</p>
        </div>
      </div>

      {/* About */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <p className="text-gray-700">
          4+ Years of Web Development Experience. Worked with 50+ brands. 100%
          satisfied customers.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          I bring extensive expertise in tailoring WordPress and Shopify
          websites...
        </p>
        <button className="mt-3 text-sm text-blue-500">✎ Edit details</button>
      </section>

      {/* Featured Clients */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Featured Clients</h2>
        <div className="p-4 border rounded text-sm text-gray-500">
          Add up to 5 clients you've worked with
        </div>
        <button className="mt-2 text-sm text-blue-500">+ Add client</button>
      </section>

      {/* Portfolio */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Portfolio</h2>
        <div className="flex gap-3 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="w-40 h-28 bg-gray-200 rounded" />
          ))}
        </div>
        <button className="mt-2 text-sm text-blue-500">✎ Edit portfolio</button>
      </section>

      {/* Intro Video */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Intro Video</h2>
        <div className="border p-4 text-sm text-gray-500 rounded">
          Add a video to connect with buyers
        </div>
        <button className="mt-2 text-sm text-blue-500">
          + Add intro video
        </button>
      </section>

      {/* Education & Certifications */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Education</h2>
          <ul className="text-sm text-gray-700">
            <li>🎓 Harvard — B.Sc. in Computer Science (2017)</li>
            <li>🎓 PMAS Agriculture University — B.Sc. (2022)</li>
          </ul>
          <button className="mt-2 text-sm text-blue-500">
            + Add education
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Certifications</h2>
          <ul className="text-sm text-gray-700">
            <li>📄 DigiSkills WordPress & Shopify — 2018</li>
            <li>📄 Enablers Amazon Wholesale — 2021</li>
          </ul>
          <button className="mt-2 text-sm text-blue-500">
            ✎ Edit certifications
          </button>
        </div>
      </div>

      {/* Skills & Expertise */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Skills & Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "WordPress expert",
            "Payment gateway expert",
            "Google SEO expert",
            "E-commerce",
            "Migration expert",
            "Wix designer",
          ].map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 border rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
        <button className="mt-2 text-sm text-blue-500">✎ Edit skills</button>
      </section>
    </div>
  );
};

export default SellerProfile;
