import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";

const formatPrice = (amount) =>
  `${currency}${Number(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const productsResponse = await axios.get(backendUrl + "/api/product/list");
      const products = productsResponse.data.success ? productsResponse.data.products : [];

      const ordersResponse = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      const orders = ordersResponse.data?.orders || [];

      const totalProducts = products.length;
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(
        (order) =>
          (order.orderStatus || order.status) !== "Delivered" &&
          (order.orderStatus || order.status) !== "Cancelled"
      ).length;

      const totalRevenue = orders
        .filter((order) =>
          (order.orderStatus === "Delivered" || order.status === "Delivered") &&
          (order.payment === true || order.paymentStatus === "Completed")
        )
        .reduce((sum, order) => sum + (order.amount || 0), 0);

      const recent = orders
        .slice()
        .reverse()
        .slice(0, 5);

      setStats({
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
      });
      setRecentOrders(recent);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = String(status || "").trim().toUpperCase();
    switch (normalizedStatus) {
      case "ORDER PLACED":
      case "PACKING":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "SHIPPED":
      case "OUT FOR DELIVERY":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "DELIVERED":
        return "bg-green-100 text-green-700 border border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const StatCard = ({ icon, title, value, subtitle, onClick, variant }) => (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${variant}`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 transform translate-x-6 -translate-y-6">
        {icon}
      </div>
      <div className="relative z-10">
        <p className="text-sm font-medium opacity-70 mb-2">{title}</p>
        <p className="text-3xl sm:text-4xl font-bold mb-3">{value}</p>
        {subtitle && <p className="text-xs opacity-60">{subtitle}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-black mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          variant="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border border-gray-200"
          title="Total Products"
          value={stats.totalProducts}
          icon={<svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
          onClick={() => navigate("/list")}
        />

        <StatCard
          variant="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-900 border border-blue-200"
          title="Total Orders"
          value={stats.totalOrders}
          icon={<svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-1-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>}
          onClick={() => navigate("/orders")}
        />

        <StatCard
          variant="bg-gradient-to-br from-amber-50 to-amber-100 text-amber-900 border border-amber-200"
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>}
          onClick={() => navigate("/orders")}
        />

        <StatCard
          variant="bg-gradient-to-br from-green-50 to-green-100 text-green-900 border border-green-200"
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          subtitle="From delivered orders"
          icon={<svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>}
        />
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-600 mt-1">Latest transactions from customers</p>
          </div>
          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            View All →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Items</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      #{order._id?.slice(-6) || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {order.address?.firstName} {order.address?.lastName}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                        {order.items?.length || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {order.date
                        ? new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
