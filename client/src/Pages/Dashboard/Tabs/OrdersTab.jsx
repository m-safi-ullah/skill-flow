import { useState, useEffect, useContext } from "react";
import axios from "../../../baseURL/axios.jsx";
import { GlobalContext } from "../../context/context.jsx";
import DeleteModal from "../../../Symbols/DeleteModal.jsx";

const OrdersTab = () => {
  const [tab, setTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [statusChanges, setStatusChanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { authRole } = useContext(GlobalContext);

  const isSeller = authRole === "seller";
  const isBuyer = !isSeller;

  const tabs = isSeller
    ? ["All", "pending", "fulfilled", "returned", "cancelled"]
    : ["All", "cancelled"];

  const statusOptions = ["pending", "fulfilled", "returned", "cancelled"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/order/get-orders");
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusSelect = (orderId, newStatus) => {
    setStatusChanges((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleStatusUpdate = async (orderId) => {
    const newStatus = statusChanges[orderId];
    try {
      await axios.patch(`/order/update/${orderId}`, {
        deliveryStatus: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, deliveryStatus: newStatus }
            : order
        )
      );
      setStatusChanges((prev) => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(`/order/update/${orderId}`, {
        deliveryStatus: "cancelled",
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, deliveryStatus: "cancelled" }
            : order
        )
      );
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  const filteredOrders =
    tab === "All" ? orders : orders.filter((o) => o.deliveryStatus === tab);

  return (
    <div className="p-5">
      {/* Tabs */}
      <h3 className="text-xl font-medium mb-4">Orders</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-full ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center py-4 text-gray-500">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
          <table className="min-w-[1000px] w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 border-b text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Order Status</th>
                <th className="px-4 py-3">Created At</th>
                {isBuyer && <th className="px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => {
                const isCancelled = order.deliveryStatus === "cancelled";

                return (
                  <tr
                    key={order._id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition ${
                      isCancelled ? "line-through text-gray-400" : ""
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="px-4 py-3 truncate">{order._id}</td>
                    <td className="px-4 py-3 truncate">{order.title}</td>
                    <td className="px-4 py-3">
                      {order.buyer}
                      {isSeller && order.buyerEmail && (
                        <div className="text-xs text-gray-500">
                          {order.buyerEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.seller}
                      {isBuyer && order.sellerEmail && (
                        <div className="text-xs text-gray-500">
                          {order.sellerEmail}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">Rs. {order.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isSeller ? (
                        <div className="flex items-center gap-2">
                          <select
                            onClick={(e) => e.stopPropagation()}
                            className="border px-2 py-1 rounded"
                            disabled={isCancelled}
                            value={
                              statusChanges[order._id] || order.deliveryStatus
                            }
                            onChange={(e) =>
                              handleStatusSelect(order._id, e.target.value)
                            }
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          {statusChanges[order._id] &&
                            statusChanges[order._id] !== order.deliveryStatus &&
                            !isCancelled && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(order._id);
                                }}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                              >
                                Update
                              </button>
                            )}
                        </div>
                      ) : (
                        <span className="capitalize">
                          {order.deliveryStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className="px-4 py-3"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {isBuyer &&
                        !isCancelled &&
                        order.deliveryStatus !== "fulfilled" && (
                          <DeleteModal
                            handleDelete={() => handleCancelOrder(order._id)}
                          />
                        )}
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No orders in this status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal (Optional, unchanged) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Title:</strong> {selectedOrder.title}
              </p>
              <p>
                <strong>Buyer:</strong> {selectedOrder.buyer}
              </p>
              <p>
                <strong>Buyer Email:</strong> {selectedOrder.buyerEmail}
              </p>
              <p>
                <strong>Seller:</strong> {selectedOrder.seller}
              </p>
              <p>
                <strong>Seller Email:</strong> {selectedOrder.sellerEmail}
              </p>
              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address}
              </p>
              <p>
                <strong>City:</strong> {selectedOrder.city}
              </p>
              <p>
                <strong>Postal Code:</strong> {selectedOrder.postalCode}
              </p>
              <p>
                <strong>Price:</strong> Rs. {selectedOrder.price}
              </p>
              <p>
                <strong>Payment:</strong> {selectedOrder.paymentStatus}
              </p>
              <p>
                <strong>Order Status:</strong> {selectedOrder.deliveryStatus}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
