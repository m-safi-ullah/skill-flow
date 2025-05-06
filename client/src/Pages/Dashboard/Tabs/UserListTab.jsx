import React, { useState, useEffect } from "react";
import axios from "../../../baseURL/axios";
import { useLocation } from "react-router-dom";

const UsersListTab = ({ list }) => {
  const location = useLocation();
  const path = location.pathname === `/${list}-list`;
  const [sellers, setSellers] = useState([]);
  const handleDelete = (id) => {
    console.log(`Delete seller with ID: ${id}`);
  };

  useEffect(() => {
    axios
      .get("/dashboard/getUserList", { params: { list: list } })
      .then((res) => {
        setSellers(res.data.userList);
      });
  }, [path]);

  return (
    <div className="overflow-x-auto p-5">
      <h3 className="text-xl font-medium mb-3">
        {list.charAt(0).toUpperCase() + list.slice(1)} List
      </h3>
      <table className="min-w-full bg-white rounded-lg">
        <thead className="bg-gray-100">
          <tr className="text-left text-gray-600 uppercase text-sm font-semibold">
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller, key) => (
            <tr key={key} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3">{key + 1}</td>
              <td className="p-3">{seller.name}</td>
              <td className="p-3">{seller.email}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => handleDelete(seller.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                >
                  <svg
                    className="h-5 w-5"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersListTab;
