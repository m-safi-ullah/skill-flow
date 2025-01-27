import React from "react";
import "../css/Home.css";

const Home = () => {
  return (
    <main>
      <section className="container p-4">
        <div className="home-main mx-auto rounded-lg text-center py-12 px-4">
          <h1 className="md:text-4xl text-2xl font-semibold">
            Scale your professional workforce with freelancers
          </h1>
          <p className="md:text-lg text-sm mt-4">
            Payoneer is the simple, secure, and reliable way to get paid
            globally.
          </p>
          <div className="flex justify-center mt-6">
            <div className="relative w-3/4 max-w-lg">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring focus:ring-green-300"
                placeholder="Search for any service"
              />
              <button className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-green-500 text-white px-4 py-2 pt-3 rounded-r-lg">
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </div>
          <a
            href="#open-account"
            className="inline-block bg-green-500 text-white text-lg font-medium px-6 py-3 rounded-lg mt-6 hover:bg-green-600"
          >
            Open Your Account
          </a>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: "restaurant", label: "Lifestyle Services" },
            { icon: "cast_for_education", label: "Teaching & Tutoring" },
            { icon: "brush", label: "Creative Arts" },
            { icon: "settings_accessibility", label: "Personal Development" },
            { icon: "play_circle", label: "Video Editing" },
            { icon: "grocery", label: "Miscellaneous" },
          ].map((category, index) => (
            <div
              key={index}
              className="p-6 shadow-md rounded-lg bg-white text-center"
            >
              <span className="material-symbols-outlined text-4xl text-secondry">
                {category.icon}
              </span>
              <h5 className="mt-4 font-medium">{category.label}</h5>
            </div>
          ))}
        </div>
      </div>

      <section className="py-12 mt-12 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-secondry">
            Think business payments. Think Payoneer.
          </h2>
          <p className="mt-4 text-gray-600">
            Discover what we have to offer and how we can help you grow your
            business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "Freelancers",
                description: "Secure payments from your clients worldwide.",
              },
              {
                title: "Businesses",
                description: "Pay and get paid globally with ease.",
              },
              {
                title: "Marketplaces",
                description: "Reliable payments for global transactions.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 shadow-md rounded-lg bg-white text-center"
              >
                <h4 className="text-xl font-semibold">{feature.title}</h4>
                <p className="text-gray-600 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto text-center py-12 mt-12 px-4">
        <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
        <p className="text-gray-600 mt-4">
          Open your Payoneer account today and experience the benefits.
        </p>
        <a
          href="#open-account"
          className="inline-block bg-green-500 text-white text-lg font-medium px-6 py-3 rounded-lg mt-6 hover:bg-green-600"
        >
          Open Your Account
        </a>
      </section>

      <section className="py-12 mt-12 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-secondry">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                quote:
                  "Payoneer has transformed the way we do business globally.",
                author: "John D., Freelancer",
              },
              {
                quote:
                  "Reliable, secure, and easy to use for all our payments.",
                author: "Sarah L., Business Owner",
              },
              {
                quote: "The best payment solution for marketplaces like ours!",
                author: "Emily R., Marketplace Manager",
              },
            ].map((testimonial, index) => (
              <blockquote
                key={index}
                className="p-6 shadow-md rounded-lg bg-white"
              >
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                <footer className="mt-4 text-sm text-gray-500">
                  {testimonial.author}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
