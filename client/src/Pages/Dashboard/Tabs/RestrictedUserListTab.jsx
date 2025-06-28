import React, { useState, useEffect } from "react";
import axios from "../../../baseURL/axios";
import { useLocation } from "react-router-dom";
import ConfirmModal from "../../../Symbols/ConfirmModal";
import Toast from "../../../Symbols/Toast";
import Loading from "../../../Symbols/Loading";

const RestrictedUserListTab = ({ list }) => {
  const location = useLocation();
  const path = location.pathname === `/${list}-list`;
  const [sellers, setSellers] = useState([]);
  const [toast, setToast] = useState({ status: "", message: "" });
  const [loadVisibility, setLoadVisibility] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const handleRestriction = (email) => {
    setToast({ status: "", message: "" });
    setLoadVisibility(true);
    axios
      .post("/auth/signIn", { email, list })
      .then((res) => {
        if (res.data.success) {
          setRefresh(true);
          setToast({
            status: "success",
            message: "Successfully update the status",
          });
        } else {
          setToast({
            status: "error",
            message: "Failed to update the status",
          });
        }
      })
      .catch((error) => {
        console.error("Error restricting user:", error);
      })
      .finally(() => {
        setLoadVisibility(false);
      });
  };

  useEffect(() => {
    axios
      .get("/dashboard/getUserList", {
        params: { list: list, restricted: true },
      })
      .then((res) => {
        setSellers(res.data.userList);
      });
  }, [path, refresh]);

  return (
    <div className="overflow-x-auto p-5">
      <Loading visible={loadVisibility} />
      <Toast status={toast.status} message={toast.message} />
      <h3 className="text-xl font-medium mb-3">
        Restricted {list.charAt(0).toUpperCase() + list.slice(1)} List
      </h3>
      <table className="min-w-full bg-white rounded-lg">
        <thead className="bg-gray-100">
          <tr className="text-left text-gray-600 uppercase text-sm font-semibold">
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            {list !== "admin" && <th className="p-3 text-center">Action</th>}
          </tr>
        </thead>
        <tbody>
          {sellers.length === 0 ? (
            <tr>
              <td
                colSpan={list !== "admin" ? 4 : 3}
                className="p-3 text-center text-gray-500"
              >
                No {list} Restricted
              </td>
            </tr>
          ) : (
            sellers.map((seller, key) => (
              <tr
                key={key}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3">{key + 1}</td>
                <td className="p-3">{seller.name}</td>
                <td className="p-3">{seller.email}</td>
                {list !== "admin" && (
                  <td className="p-3 text-center">
                    <ConfirmModal
                      bg={seller.restriction ? "bg-green-500" : "bg-red-500"}
                      text={seller.restriction ? "Unrestrict" : "Restrict"}
                      handleDelete={() => handleRestriction(seller.email)}
                    />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RestrictedUserListTab;
