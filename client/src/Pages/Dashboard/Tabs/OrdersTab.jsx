import { useState } from "react";

const dummyOrders = [
  {
    _id: "64f1a3c8e8e9ab1234567890",
    title: "Logo Design Service",
    price: "100",
    productId: "prod_001",
    seller: "junaid",
    buyer: "safi",
    phone: "03001234567",
    address: "123 Street Name",
    city: "Lahore",
    postalCode: "54000",
    additionalRequirements: "Use red and black colors",
    createdAt: "2025-07-01T10:30:00Z",
    paymentStatus: "paid",
    deliveryStatus: "pending",
  },
  {
    _id: "64f1a3c8e8e9ab1234567891",
    title: "Full Website Development",
    price: "700",
    productId: "prod_002",
    seller: "junaid",
    buyer: "ahmed",
    phone: "03101234567",
    address: "456 Avenue Road",
    city: "Islamabad",
    postalCode: "44000",
    additionalRequirements: "Dark theme preferred",
    createdAt: "2025-06-28T15:20:00Z",
    paymentStatus: "paid",
    deliveryStatus: "fulfilled",
  },
  {
    _id: "64f1a3c8e8e9ab1234567892",
    title: "Mobile App UI Design",
    price: "250",
    productId: "prod_003",
    seller: "junaid",
    buyer: "safi",
    phone: "03451234567",
    address: "789 Central Blvd",
    city: "Karachi",
    postalCode: "75000",
    additionalRequirements: "Minimalist layout",
    createdAt: "2025-06-25T09:45:00Z",
    paymentStatus: "pending",
    deliveryStatus: "returned",
  },
  {
    _id: "64f1a3c8e8e9ab1234567893",
    title: "Poster Design",
    price: "80",
    productId: "prod_004",
    seller: "junaid",
    buyer: "ali",
    phone: "03331234567",
    address: "Main Road, Sector G",
    city: "Peshawar",
    postalCode: "25000",
    additionalRequirements: "A4 size, bold fonts",
    createdAt: "2025-07-01T13:10:00Z",
    paymentStatus: "refunded",
    deliveryStatus: "cancelled",
  },
];

const OrdersTab = ({ ordersFromAPI = dummyOrders }) => {
  const [tab, setTab] = useState("All");
  const [orders, setOrders] = useState(ordersFromAPI);

  const isSeller = "seller";

  const tabs = isSeller
    ? ["All", "pending", "fulfilled", "returned", "cancelled"]
    : ["All", "cancelled"];

  const statusOptions = isSeller
    ? ["pending", "fulfilled", "returned", "cancelled"]
    : ["cancelled"];

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
      )
    );

    try {
      await fetch(`/api/orders/update/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const filteredOrders =
    tab === "All" ? orders : orders.filter((o) => o.deliveryStatus === tab);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-full ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
        <table className="min-w-[1000px] w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => (
              <tr
                key={order._id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition`}
              >
                <td className="px-4 py-3">{order._id}</td>
                <td className="px-4 py-3">{order.title}</td>
                <td className="px-4 py-3">{order.buyer}</td>
                <td className="px-4 py-3">{order.seller}</td>
                <td className="px-4 py-3">${order.price}</td>
                <td className="px-4 py-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <select
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={order.deliveryStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={
                      isSeller
                        ? false
                        : order.deliveryStatus === "cancelled" ||
                          order.deliveryStatus === "fulfilled"
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No orders in this status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTab;
