import React from "react";
import "../../css/Dashboard.css";

const Buyer = ({ activeSection }) => {
  return (
    <>
      {activeSection === "seller-list" && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Sellers</h3>
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">1</td>
                <td className="border border-gray-300 p-2">John Doe</td>
                <td className="border border-gray-300 p-2">john@example.com</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">2</td>
                <td className="border border-gray-300 p-2">Jane Smith</td>
                <td className="border border-gray-300 p-2">jane@example.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {activeSection === "buyer-list" && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Buyers</h3>
          <p>Here is the buyer information.</p>
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">1</td>
                <td className="border border-gray-300 p-2">John Doe</td>
                <td className="border border-gray-300 p-2">john@example.com</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">2</td>
                <td className="border border-gray-300 p-2">Jane Smith</td>
                <td className="border border-gray-300 p-2">jane@example.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {activeSection === "restricted-sellers" && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Restricted Sellers</h3>
          <p>These sellers are restricted.</p>
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">1</td>
                <td className="border border-gray-300 p-2">John Doe</td>
                <td className="border border-gray-300 p-2">john@example.com</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">2</td>
                <td className="border border-gray-300 p-2">Jane Smith</td>
                <td className="border border-gray-300 p-2">jane@example.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {activeSection === "restricted-buyers" && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Restricted Buyers</h3>
          <p>These buyers are restricted.</p>
          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">1</td>
                <td className="border border-gray-300 p-2">John Doe</td>
                <td className="border border-gray-300 p-2">john@example.com</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">2</td>
                <td className="border border-gray-300 p-2">Jane Smith</td>
                <td className="border border-gray-300 p-2">jane@example.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {activeSection === "settings" && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Settings</h3>
          <p>Configure your settings here.</p>
        </div>
      )}
    </>
  );
};

export default Buyer;
