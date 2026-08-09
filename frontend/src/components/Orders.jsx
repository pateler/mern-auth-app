import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Orders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');

    // Mock data for order statistics
    const stats = [
        {
            label: 'Total Orders',
            value: '1,245',
            change: '+12%',
            changeLabel: 'This month',
            changeType: 'positive',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Pending',
            value: '127',
            change: '+16%',
            changeLabel: 'This month',
            changeType: 'positive',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        },
        {
            label: 'Processing',
            value: '47',
            change: '+8%',
            changeLabel: 'This week',
            changeType: 'positive',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
        {
            label: 'Completed',
            value: '1,180',
            change: '+15%',
            changeLabel: 'This month',
            changeType: 'positive',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
    ];

    // Mock orders data
    const allOrders = [
        { id: '#ORD-1024', customer: 'Amit Kumar', date: 'May 6, 2026', status: 'Processing', payment: 'Paid', amount: '₹2,400' },
        { id: '#ORD-1024', customer: 'Sufyan Shaikh', date: 'May 6, 2026', status: 'Processing', payment: 'Paid', amount: '₹2,400' },
        { id: '#ORD-1023', customer: 'Sanket Patil', date: 'May 5, 2026', status: 'Completed', payment: 'Pending', amount: '₹1,800' },
        { id: '#ORD-1023', customer: 'Sanket Patil', date: 'May 5, 2026', status: 'Completed', payment: 'Pending', amount: '₹1,800' },
        { id: '#ORD-1022', customer: 'Saurabh Chaudhari', date: 'May 5, 2026', status: 'Completed', payment: 'Completed', amount: '₹3,200' },
        { id: '#ORD-1022', customer: 'Saurabh Chaudhari', date: 'May 5, 2026', status: 'Completed', payment: 'Completed', amount: '₹3,200' },
        { id: '#ORD-1021', customer: 'Abhishek Borude', date: 'May 4, 2026', status: 'Cancelled', payment: 'Refunded', amount: '₹3,200' },
        { id: '#ORD-1020', customer: 'Pankaj Jangid', date: 'May 3, 2026', status: 'Completed', payment: 'COD', amount: '₹3,200' },
        { id: '#ORD-1019', customer: 'Rahul Sharma', date: 'May 3, 2026', status: 'Processing', payment: 'Paid', amount: '₹1,500' },
        { id: '#ORD-1018', customer: 'Priya Patel', date: 'May 2, 2026', status: 'Completed', payment: 'Completed', amount: '₹4,200' },
    ];

    const getStatusColor = (status) => {
        const colors = {
            'Processing': 'bg-blue-100 text-blue-800',
            'Completed': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentColor = (payment) => {
        const colors = {
            'Paid': 'bg-green-100 text-green-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Completed': 'bg-blue-100 text-blue-800',
            'Refunded': 'bg-red-100 text-red-800',
            'COD': 'bg-purple-100 text-purple-800',
        };
        return colors[payment] || 'bg-gray-100 text-gray-800';
    };

    // Filter orders based on search and status
    const filteredOrders = allOrders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    // Get unique statuses for filter
    const statuses = ['All', ...new Set(allOrders.map(order => order.status))];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar activePage="orders" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
                        <p className="text-sm text-gray-500">Manage and track all your orders</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search orders..."
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-64"
                            />
                        </div>

                        {/* Add Order Button */}
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Order
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                            <div className="flex items-center gap-1 mt-1.5">
                                                <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {stat.change}
                                                </span>
                                                <span className="text-xs text-gray-400">{stat.changeLabel}</span>
                                            </div>
                                        </div>
                                        <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.textColor} text-xl flex-shrink-0`}>
                                            {stat.label === 'Total Orders' && '📦'}
                                            {stat.label === 'Pending' && '⏳'}
                                            {stat.label === 'Processing' && '⚙️'}
                                            {stat.label === 'Completed' && '✅'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Orders Table */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {/* Table Header with Filters */}
                            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
                                <h3 className="text-lg font-semibold text-gray-800">Search orders</h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by order ID or customer..."
                                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-64 text-sm"
                                        />
                                    </div>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredOrders.map((order, index) => (
                                            <tr key={`${order.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-700">{order.customer}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-500">{order.date}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPaymentColor(order.payment)}`}>
                                                        {order.payment}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{order.amount}</td>
                                                <td className="px-5 py-3.5">
                                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredOrders.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No orders found matching your criteria</p>
                                    </div>
                                )}
                            </div>

                            {/* Table Footer */}
                            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Showing {filteredOrders.length} of {allOrders.length} orders
                                </p>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                                        Previous
                                    </button>
                                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        1
                                    </button>
                                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        2
                                    </button>
                                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        3
                                    </button>
                                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;