/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "./Layout";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activePeriod, setActivePeriod] = useState("12 months");

  // Mock data for dashboard
  const stats = [
    { label: "Total Orders", value: "1,245", icon: "📦", color: "bg-blue-500" },
    { label: "Revenue", value: "₹4,32,500", icon: "💰", color: "bg-green-500" },
    {
      label: "Pending Orders",
      value: "18",
      icon: "⏳",
      color: "bg-orange-500",
    },
    {
      label: "Conversion Rate",
      value: "3.8%",
      icon: "📊",
      color: "bg-purple-500",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-1024",
      customer: "Sufyan Shaikh",
      date: "May 6, 2026",
      status: "Processing",
      payment: "Paid",
      amount: "₹2,400",
    },
    {
      id: "#ORD-1023",
      customer: "Sanket Patil",
      date: "May 5, 2026",
      status: "Completed",
      payment: "Pending",
      amount: "₹1,800",
    },
    {
      id: "#ORD-1022",
      customer: "Saurabh Chaudhari",
      date: "May 5, 2026",
      status: "Completed",
      payment: "Completed",
      amount: "₹3,200",
    },
    {
      id: "#ORD-1021",
      customer: "Abhishek Borude",
      date: "May 4, 2026",
      status: "Cancelled",
      payment: "Refunded",
      amount: "₹3,200",
    },
    {
      id: "#ORD-1020",
      customer: "Pankaj Jangid",
      date: "May 3, 2026",
      status: "Completed",
      payment: "COD",
      amount: "₹3,200",
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      Processing: "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Pending: "bg-yellow-100 text-yellow-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentColor = (payment) => {
    const colors = {
      Paid: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Completed: "bg-blue-100 text-blue-800",
      Refunded: "bg-red-100 text-red-800",
      COD: "bg-purple-100 text-purple-800",
    };
    return colors[payment] || "bg-gray-100 text-gray-800";
  };

  // Chart data for revenue
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const revenueData = [
    180, 150, 200, 120, 170, 190, 140, 160, 210, 130, 155, 185,
  ];
  const maxRevenue = Math.max(...revenueData);

  // Chart data for traffic sources
  const trafficSources = [
    { name: "Direct", value: 1735, percentage: 76.1, color: "bg-blue-500" },
    { name: "Meta Ads", value: 217, percentage: 13.4, color: "bg-green-500" },
    {
      name: "Google Maps",
      value: 124,
      percentage: 6.2,
      color: "bg-orange-500",
    },
    {
      name: "Organic Search",
      value: 53,
      percentage: 3.4,
      color: "bg-purple-500",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back,{" "}
              <span className="font-semibold text-gray-700">{user?.name}</span>!
            </p>
          </div>
          {isAdmin && (
            <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Admin
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-white text-lg`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Revenue report
              </h3>
              <div className="flex gap-1">
                {["12 months", "6 months", "30 days", "7 days"].map(
                  (period) => (
                    <button
                      key={period}
                      onClick={() => setActivePeriod(period)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                        activePeriod === period
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {period}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-48 flex items-end gap-1.5">
              {revenueData.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-200"
                    style={{
                      height: `${(value / maxRevenue) * 100}%`,
                      minHeight: "4px",
                    }}
                  ></div>
                  <span className="text-xs text-gray-500">{months[index]}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-400">
              <span>₹0</span>
              <span>₹200k</span>
              <span>₹150k</span>
              <span>₹100k</span>
              <span>₹50k</span>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Traffic Sources
            </h3>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{source.name}</span>
                    <span className="font-medium text-gray-900">
                      {source.value.toLocaleString()} clicks
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${source.color} rounded-full transition-all duration-500`}
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                    <span>{source.percentage}%</span>
                    <span>{source.value} clicks</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Clicks</span>
                <span className="font-semibold text-gray-900">2,129</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPaymentColor(order.payment)}`}
                      >
                        {order.payment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
