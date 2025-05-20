import React, { useState } from "react";

const faqs = [
  {
    question: "What is SkillFlow?",
    answer:
      "SkillFlow is a modern freelancing platform that connects clients with skilled freelancers across a wide range of digital services.",
  },
  {
    question: "How do I sign up as a freelancer or client?",
    answer:
      "Simply click the 'Sign Up' button on the homepage, choose your role (freelancer or client), and complete the registration form.",
  },
  {
    question: "Is my data safe on SkillFlow?",
    answer:
      "Yes, we prioritize user security with encrypted data storage, secure authentication, and ongoing security monitoring.",
  },
  {
    question: "How does the payment process work?",
    answer:
      "Clients pay for services through our secure payment gateway. Funds are held in escrow and released to freelancers upon project completion.",
  },
  {
    question: "Can I communicate with users in real-time?",
    answer:
      "Yes, SkillFlow features a built-in real-time messaging system so freelancers and clients can stay in touch easily.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left text-lg font-medium text-blue-700 hover:bg-blue-100 focus:outline-none"
              >
                {faq.question}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 border-t border-blue-100 bg-blue-50 text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
