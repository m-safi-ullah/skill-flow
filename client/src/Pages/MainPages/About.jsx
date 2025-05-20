import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gradient-to-br from-white via-sky-50 to-sky-100 min-h-screen px-6 sm:px-12 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-400 to-teal-400 bg-clip-text text-transparent drop-shadow-md">
            Skill Flow
          </h2>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-sky-900 mb-6 animate-fade-in">
          About Us
        </h2>
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-12 animate-fade-in delay-150">
          SkillFlow is your dynamic bridge between talent and opportunity. Our
          platform empowers freelancers and clients to connect, collaborate, and
          grow together in a safe, intuitive, and transparent environment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in delay-300">
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition duration-300 text-left">
            <h3 className="text-2xl font-semibold text-sky-700 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600">
              To redefine how the world works together by fostering a global
              marketplace of trust, collaboration, and innovation in the
              freelancing industry.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition duration-300 text-left">
            <h3 className="text-2xl font-semibold text-sky-700 mb-4">
              What We Offer
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Quick and secure onboarding process</li>
              <li>Smart dashboards tailored to users' roles</li>
              <li>Real-time messaging and alerts</li>
              <li>Transparent reviews and feedback system</li>
              <li>Streamlined service posting and hiring workflows</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition duration-300 text-left">
            <h3 className="text-2xl font-semibold text-sky-700 mb-4">
              Why Choose Us?
            </h3>
            <p className="text-gray-600">
              We put users first with a focus on seamless interactions, platform
              reliability, and continuous innovation—making freelancing a breeze
              for all involved.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition duration-300 text-left">
            <h3 className="text-2xl font-semibold text-sky-700 mb-4">
              Scalable & Future-Ready
            </h3>
            <p className="text-gray-600">
              SkillFlow is built with scalability in mind—ready to grow with
              your ambitions, enriched regularly with features shaped by our
              community’s voice.
            </p>
          </div>
        </div>

        <div className="mt-20 animate-fade-in delay-500">
          <h4 className="text-2xl sm:text-3xl font-semibold text-sky-800 mb-4">
            Become Part of the SkillFlow Network
          </h4>
          <p className="text-gray-700 text-lg mb-6">
            Whether you're a skilled professional or a business in search of
            excellence, SkillFlow is your gateway to success.
          </p>

          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <button className="bg-gradient-to-r from-sky-600 to-sky-800 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
