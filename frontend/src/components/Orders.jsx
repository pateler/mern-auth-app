import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AddOrderModal from './AddOrderModal';
import ViewOrderModal from './ViewOrderModal';

const Orders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
    const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [orders, setOrders] = useState([
        { id: '#ORD-1024', customer: 'Sufyan Shaikh', date: 'May 6, 2026', status: 'Processing', payment: 'Paid', amount: '₹2,400' },
        { id: '#ORD-1023', customer: 'Sanket Patil', date: 'May 5, 2026', status: 'Completed', payment: 'Pending', amount: '₹1,800' },
        { id: '#ORD-1022', customer: 'Saurabh Chaudhari', date: 'May 5, 2026', status: 'Completed', payment: 'Completed', amount: '₹3,200' },
        { id: '#ORD-1021', customer: 'Abhishek Borude', date: 'May 4, 2026', status: 'Cancelled', payment: 'Refunded', amount: '₹3,200' },
        { id: '#ORD-1020', customer: 'Pankaj Jangid', date: 'May 3, 2026', status: 'Completed', payment: 'COD', amount: '₹3,200' },
        { id: '#ORD-1019', customer: 'Rahul Sharma', date: 'May 3, 2026', status: 'Processing', payment: 'Paid', amount: '₹1,500' },
        { id: '#ORD-1018', customer: 'Priya Patel', date: 'May 2, 2026', status: 'Completed', payment: 'Completed', amount: '₹4,200' },
        { id: '#ORD-1017', customer: 'Amit Kumar', date: 'May 1, 2026', status: 'Pending', payment: 'Pending', amount: '₹3,600' },
        { id: '#ORD-1016', customer: 'Neha Singh', date: 'Apr 30, 2026', status: 'Completed', payment: 'Paid', amount: '₹1,200' },
        { id: '#ORD-1015', customer: 'Vikram Mehta', date: 'Apr 29, 2026', status: 'Cancelled', payment: 'Refunded', amount: '₹5,000' },
    ]);

    // Mock data for order statistics
    const stats = [
        {
            label: 'Total Orders',
            value: orders.length.toString(),
            change: '+12%',
            changeLabel: 'This month',
            changeType: 'positive',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Pending',
            value: orders.filter(o => o.status === 'Pending').length.toString(),
            change: '+16%',
            changeLabel: 'This month',
            changeType: 'positive',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        },
        {
            label: 'Processing',
            value: orders.filter(o => o.status === 'Processing').length.toString(),
            change: '+8%',
            changeLabel: 'This week',
            changeType: 'positive',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
        {
            label: 'Completed',
            value: orders.filter(o => o.status === 'Completed').length.toString(),
            change: '+15%',
            changeLabel: 'This month',
            changeType: 'positive',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
    ];

    const itemsPerPage = 5;

    const getStatusColor = (status) => {
        const colors = {
            'Processing': 'bg-blue-100 text-blue-800',
            'Completed': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Refunded': 'bg-purple-100 text-purple-800',
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
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    // Get unique statuses for filter
    const statuses = ['All', ...new Set(orders.map(order => order.status))];

    const handleAddOrder = (newOrder) => {
        // Generate new order ID
        const lastId = orders.length > 0 ? parseInt(orders[0].id.replace('#ORD-', '')) : 1017;
        const newId = `#ORD-${lastId + 1}`;

        const orderToAdd = {
            ...newOrder,
            id: newId,
        };

        setOrders([orderToAdd, ...orders]);
        setIsAddOrderOpen(false);
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsViewOrderOpen(true);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar activePage="orders" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className="flex-1 min-w-[120px]">
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Orders</h1>
                        <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">Manage and track all your orders</p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap ml-auto">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[140px] max-w-xs sm:max-w-md">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        {/* Add Order Button */}
                        <button
                            onClick={() => setIsAddOrderOpen(true)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="hidden xs:inline">Add Order</span>
                            <span className="xs:hidden">Add</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</p>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                            <div className="flex items-center gap-1 mt-1.5">
                                                <span className={`text-xs sm:text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {stat.change}
                                                </span>
                                                <span className="text-[10px] sm:text-xs text-gray-400">{stat.changeLabel}</span>
                                            </div>
                                        </div>
                                        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.textColor} text-base sm:text-xl flex-shrink-0`}>
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
                            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Search orders</h3>
                                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:flex-initial min-w-[140px]">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by ID or customer..."
                                            className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm font-medium text-gray-900">{order.id}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-700">{order.customer}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-500">{order.date}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${getPaymentColor(order.payment)}`}>
                                                        {order.payment}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm font-medium text-gray-900">{order.amount}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <button
                                                        onClick={() => handleViewOrder(order)}
                                                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredOrders.length === 0 && (
                                    <div className="text-center py-6 sm:py-8">
                                        <p className="text-sm text-gray-500">No orders found matching your criteria</p>
                                    </div>
                                )}
                            </div>

                            {/* Table Footer */}
                            <div className="px-4 sm:px-5 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Showing {paginatedOrders.length} of {filteredOrders.length} orders
                                </p>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Order Modal */}
            <AddOrderModal
                isOpen={isAddOrderOpen}
                onClose={() => setIsAddOrderOpen(false)}
                onAddOrder={handleAddOrder}
            />

            {/* View Order Modal */}
            <ViewOrderModal
                isOpen={isViewOrderOpen}
                onClose={() => setIsViewOrderOpen(false)}
                order={selectedOrder}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default Orders;