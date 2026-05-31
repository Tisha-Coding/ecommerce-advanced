import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";

const formatPrice = (amount) =>
  `${currency}${Number(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusStyles = (status) => {
    const normalizedStatus = String(status || "").trim().toUpperCase();
    switch (normalizedStatus) {
      case "ORDER PLACED":
      case "PACKING":
        return "bg-amber-50 text-amber-800 border border-amber-200";
      case "SHIPPED":
      case "OUT FOR DELIVERY":
        return "bg-sky-50 text-sky-800 border border-sky-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-800 border border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const customerName = `${order.address.firstName} ${order.address.lastName}`.toLowerCase();
    const phone = order.address.phone?.toLowerCase() || "";
    const orderId = order._id?.toLowerCase() || "";
    return (
      customerName.includes(query) ||
      phone.includes(query) ||
      orderId.includes(query) ||
      order.items.some((item) => item.name.toLowerCase().includes(query))
    );
  });

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;

    // Optimistically update the status locally
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully");
        await fetchAllOrders(); // Refresh orders list
      } else {
        toast.error(response.data.message || "Could not update status. Please try again.");
        await fetchAllOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update status. Please try again.");
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders(); // Correctly invoke fetchAllOrders
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-600">Manage and track all customer orders</p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:max-w-md">
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, or order ID..."
                className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-10 focus:outline-none transition-all"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 py-16 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4m0 0L4 7m16 0l-8 4m0 0l8 4m-8-4v10m0 0l-8-4m8 4l8-4" />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No orders found" : "No orders yet"}
          </p>
          <p className="text-gray-600">
            {searchQuery
              ? "Try adjusting your search query."
              : "Orders will appear here once customers place them."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <img className="w-6 h-6 object-contain" src={assets.parcel_icon} alt="Order" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-bold text-gray-900">#{order._id?.slice(-6)}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${getStatusStyles(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Order Content */}
              <div className="p-6 space-y-6">
                {/* Products */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">📦 Items</h3>
                  <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        <p className="font-medium text-gray-900">
                          {item.name} <span className="text-gray-600">×{item.quantity}</span>
                          <span className="ml-2 text-sm bg-gray-100 px-2 py-1 rounded">{item.size}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {currency}{Number(item.price).toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                          })} each
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">👤 Customer</h3>
                    <div className="space-y-2 text-sm">
                      <p className="font-medium text-gray-900">
                        {order.address.firstName} {order.address.lastName}
                      </p>
                      <p className="text-gray-600">{order.address.phone}</p>
                      {order.address.email && <p className="text-gray-600">{order.address.email}</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">📍 Delivery Address</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{order.address.street}</p>
                      <p>{order.address.city}, {order.address.state}</p>
                      <p>{order.address.country} - {order.address.zipcode}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 bg-gray-50 rounded-xl px-4">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">ITEMS</p>
                    <p className="font-bold text-gray-900">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">PAYMENT</p>
                    <p className={`font-bold ${order.paymentStatus === "Completed" || order.payment ? "text-green-600" : "text-amber-600"}`}>
                      {order.paymentStatus || (order.payment ? "Paid" : "Pending")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">DATE</p>
                    <p className="font-bold text-gray-900 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">TOTAL</p>
                    <p className="font-bold text-gray-900">{formatPrice(order.amount)}</p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Update Order Status</label>
                  <select
                    onChange={(event) => statusHandler(event, order._id)}
                    value={order.status}
                    className="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg font-medium focus:outline-none focus:border-blue-600 transition-colors"
                  >
                    <option value="Order Placed">📋 Order Placed</option>
                    <option value="Packing">📦 Packing</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Out for delivery">🚗 Out for delivery</option>
                    <option value="Delivered">✅ Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
