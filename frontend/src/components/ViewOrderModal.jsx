import React, { useState } from 'react';

const ViewOrderModal = ({ isOpen, onClose, order, onStatusChange }) => {
    const [newStatus, setNewStatus] = useState(order?.status || 'Pending');

    if (!isOpen || !order) return null;

    const handleStatusUpdate = () => {
        if (onStatusChange && newStatus !== order.status) {
            onStatusChange(order.id, newStatus);
        }
    };

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

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-2xl flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                            <p className="text-sm text-gray-500">{order.id}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Order Status Update */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Update Status
                                </label>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Refunded">Refunded</option>
                                    </select>
                                    {newStatus !== order.status && (
                                        <button
                                            onClick={handleStatusUpdate}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Update
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Current Status</p>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Customer</p>
                                <p className="font-medium text-gray-800">{order.customer}</p>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-medium text-gray-800">{order.date}</p>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Payment</p>
                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPaymentColor(order.payment)}`}>
                                    {order.payment}
                                </span>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-xl font-bold text-gray-800">{order.amount}</p>
                            </div>
                        </div>

                        {/* Order Items (if available) */}
                        {order.items && order.items.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Order Items</h3>
                                <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                <p className="text-sm text-gray-500">SKU: {item.sku || 'N/A'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                <p className="font-medium text-gray-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Order Timeline */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Order Timeline</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-3 h-3 mt-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Order Created</p>
                                        <p className="text-xs text-gray-500">{order.date} • Order #{order.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${order.status === 'Processing' || order.status === 'Completed'
                                            ? 'bg-blue-500'
                                            : 'bg-gray-300'
                                        }`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Processing</p>
                                        <p className="text-xs text-gray-500">
                                            {order.status === 'Processing' || order.status === 'Completed'
                                                ? 'Order is being processed'
                                                : 'Pending'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={`w-3 h-3 mt-1.5 rounded-full flex-shrink-0 ${order.status === 'Completed'
                                            ? 'bg-green-500'
                                            : 'bg-gray-300'
                                        }`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Delivered</p>
                                        <p className="text-xs text-gray-500">
                                            {order.status === 'Completed'
                                                ? 'Order delivered successfully'
                                                : 'Pending'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Print Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewOrderModal;