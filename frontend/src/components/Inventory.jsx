import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Inventory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Mock data for inventory statistics
    const stats = [
        {
            label: 'Top Selling Products',
            value: '32',
            change: '+12%',
            changeLabel: 'This month',
            changeType: 'positive',
            icon: '🏆',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Low Stocks Products',
            value: '18',
            change: '+16%',
            changeLabel: 'This month',
            changeType: 'positive',
            icon: '⚠️',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        },
        {
            label: 'Out Of Stock',
            value: '7',
            change: '-8%',
            changeLabel: 'This week',
            changeType: 'negative',
            icon: '🚫',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600'
        },
        {
            label: 'Inventory Value',
            value: '16.4L',
            change: '+0.6%',
            changeLabel: 'This month',
            changeType: 'positive',
            icon: '💰',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
    ];

    // Mock inventory data
    const inventoryItems = [
        {
            id: 1,
            product: 'Nike Air Max 97 Running Shoes',
            sku: 'NK-8821',
            category: 'Footwear',
            soldThisMonth: 182,
            availableStock: 12,
            revenue: '₹4,82,000',
            status: 'Low Stock'
        },
        {
            id: 2,
            product: 'Jordan Oversized Hoodie Apparel',
            sku: 'JH-2511',
            category: 'Apparel',
            soldThisMonth: 144,
            availableStock: 82,
            revenue: '₹2,11,000',
            status: 'Healthy'
        },
        {
            id: 3,
            product: 'iPhone 15 Transparent Case Accessories',
            sku: 'IP-1120',
            category: 'Accessories',
            soldThisMonth: 412,
            availableStock: 4,
            revenue: '₹1,02,000',
            status: 'Critical'
        },
        {
            id: 4,
            product: 'Adidas Ultraboost 97 Running Shoes',
            sku: 'AD-7722',
            category: 'Footwear',
            soldThisMonth: 156,
            availableStock: 45,
            revenue: '₹3,24,000',
            status: 'Healthy'
        },
        {
            id: 5,
            product: 'Apple Watch Band Accessories',
            sku: 'AW-3341',
            category: 'Accessories',
            soldThisMonth: 89,
            availableStock: 0,
            revenue: '₹67,000',
            status: 'Out of Stock'
        },
        {
            id: 6,
            product: 'Samsung Galaxy S24 Ultra Case',
            sku: 'SG-4421',
            category: 'Accessories',
            soldThisMonth: 234,
            availableStock: 15,
            revenue: '₹1,85,000',
            status: 'Low Stock'
        },
        {
            id: 7,
            product: 'Puma RS-X Sneakers',
            sku: 'PU-6632',
            category: 'Footwear',
            soldThisMonth: 98,
            availableStock: 28,
            revenue: '₹2,76,000',
            status: 'Healthy'
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            'Healthy': 'bg-green-100 text-green-800',
            'Low Stock': 'bg-yellow-100 text-yellow-800',
            'Critical': 'bg-orange-100 text-orange-800',
            'Out of Stock': 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusDotColor = (status) => {
        const colors = {
            'Healthy': 'bg-green-500',
            'Low Stock': 'bg-yellow-500',
            'Critical': 'bg-orange-500',
            'Out of Stock': 'bg-red-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    // Get unique categories for filter
    const categories = ['All', ...new Set(inventoryItems.map(item => item.category))];

    // Filter items based on search and category
    const filteredItems = inventoryItems.filter(item => {
        const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar activePage="inventory" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Inventory</h1>
                        <p className="text-sm text-gray-500">Manage your products and stock levels</p>
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

                        {/* Add Product Button */}
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Product
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
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inventory Table */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {/* Table Header with Filters */}
                            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
                                <h3 className="text-lg font-semibold text-gray-800">Product Inventory</h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by product or SKU..."
                                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-64 text-sm"
                                        />
                                    </div>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold This Month</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available Stock</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                                                            {item.product.split(' ').slice(0, 2).map(word => word[0]).join('')}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{item.product}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-gray-600 font-mono">{item.sku}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-700">{item.category}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-700">{item.soldThisMonth}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-sm font-medium ${item.availableStock === 0 ? 'text-red-600' :
                                                            item.availableStock <= 5 ? 'text-orange-600' :
                                                                item.availableStock <= 15 ? 'text-yellow-600' :
                                                                    'text-green-600'
                                                        }`}>
                                                        {item.availableStock}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{item.revenue}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${getStatusDotColor(item.status)}`}></div>
                                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredItems.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No products found matching your criteria</p>
                                    </div>
                                )}
                            </div>

                            {/* Table Footer */}
                            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Showing {filteredItems.length} of {inventoryItems.length} products
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

export default Inventory;