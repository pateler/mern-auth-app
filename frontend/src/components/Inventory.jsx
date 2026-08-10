import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AddProductModal from './AddProductModal';
import ViewProductModal from './ViewProductModal';

const Inventory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isViewProductOpen, setIsViewProductOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Inventory items state
    const [inventoryItems, setInventoryItems] = useState([
        {
            id: 1,
            product: 'Nike Air Max 97 Running Shoes',
            sku: 'NK-8821',
            category: 'Footwear',
            soldThisMonth: 182,
            availableStock: 12,
            revenue: '₹4,82,000',
            status: 'Low Stock',
            description: 'Comfortable running shoes with air cushioning technology',
            price: 12000,
            costPrice: 8000,
            minStockLevel: 15,
        },
        {
            id: 2,
            product: 'Jordan Oversized Hoodie Apparel',
            sku: 'JH-2511',
            category: 'Apparel',
            soldThisMonth: 144,
            availableStock: 82,
            revenue: '₹2,11,000',
            status: 'Healthy',
            description: 'Oversized hoodie with premium Jordan branding',
            price: 4500,
            costPrice: 2800,
            minStockLevel: 20,
        },
        {
            id: 3,
            product: 'iPhone 15 Transparent Case',
            sku: 'IP-1120',
            category: 'Accessories',
            soldThisMonth: 412,
            availableStock: 4,
            revenue: '₹1,02,000',
            status: 'Critical',
            description: 'Clear transparent protective case for iPhone 15',
            price: 1200,
            costPrice: 500,
            minStockLevel: 10,
        },
        {
            id: 4,
            product: 'Adidas Ultraboost 97 Running Shoes',
            sku: 'AD-7722',
            category: 'Footwear',
            soldThisMonth: 156,
            availableStock: 45,
            revenue: '₹3,24,000',
            status: 'Healthy',
            description: 'Premium running shoes with responsive cushioning',
            price: 15000,
            costPrice: 10000,
            minStockLevel: 15,
        },
        {
            id: 5,
            product: 'Apple Watch Band',
            sku: 'AW-3341',
            category: 'Accessories',
            soldThisMonth: 89,
            availableStock: 0,
            revenue: '₹67,000',
            status: 'Out of Stock',
            description: 'Premium silicone sport band for Apple Watch',
            price: 2500,
            costPrice: 800,
            minStockLevel: 10,
        },
        {
            id: 6,
            product: 'Samsung Galaxy S24 Ultra Case',
            sku: 'SG-4421',
            category: 'Accessories',
            soldThisMonth: 234,
            availableStock: 15,
            revenue: '₹1,85,000',
            status: 'Low Stock',
            description: 'Premium protective case for Samsung Galaxy S24 Ultra',
            price: 1500,
            costPrice: 600,
            minStockLevel: 10,
        },
        {
            id: 7,
            product: 'Puma RS-X Sneakers',
            sku: 'PU-6632',
            category: 'Footwear',
            soldThisMonth: 98,
            availableStock: 28,
            revenue: '₹2,76,000',
            status: 'Healthy',
            description: 'Retro-inspired sneakers with modern comfort',
            price: 8999,
            costPrice: 5500,
            minStockLevel: 15,
        },
    ]);

    const itemsPerPage = 5;

    // Calculate stats dynamically
    const stats = [
        {
            label: 'Top Selling Products',
            value: inventoryItems.filter(item => item.soldThisMonth > 150).length.toString(),
            change: '+12%',
            changeLabel: 'This month',
            changeType: 'positive',
            icon: '🏆',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            label: 'Low Stocks Products',
            value: inventoryItems.filter(item => item.status === 'Low Stock' || item.status === 'Critical').length.toString(),
            change: '+16%',
            changeLabel: 'This month',
            changeType: 'positive',
            icon: '⚠️',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        },
        {
            label: 'Out Of Stock',
            value: inventoryItems.filter(item => item.status === 'Out of Stock').length.toString(),
            change: '-8%',
            changeLabel: 'This week',
            changeType: 'negative',
            icon: '🚫',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600'
        },
        {
            label: 'Inventory Value',
            value: `₹${(inventoryItems.reduce((sum, item) => sum + (item.availableStock * item.price), 0) / 100000).toFixed(1)}L`,
            change: '+0.6%',
            changeLabel: 'This month',
            changeType: 'positive',
            icon: '💰',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
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

    // Pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const handleAddProduct = (newProduct) => {
        // Generate new ID
        const lastId = inventoryItems.length > 0 ? Math.max(...inventoryItems.map(item => item.id)) : 0;
        const newId = lastId + 1;

        // Determine status based on stock
        let status = 'Healthy';
        if (newProduct.availableStock === 0) {
            status = 'Out of Stock';
        } else if (newProduct.availableStock <= newProduct.minStockLevel * 0.3) {
            status = 'Critical';
        } else if (newProduct.availableStock <= newProduct.minStockLevel) {
            status = 'Low Stock';
        }

        const productToAdd = {
            ...newProduct,
            id: newId,
            status: status,
            revenue: `₹${(newProduct.soldThisMonth * newProduct.price).toLocaleString()}`,
        };

        setInventoryItems([productToAdd, ...inventoryItems]);
        setIsAddProductOpen(false);
    };

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setIsViewProductOpen(true);
    };

    const handleUpdateProduct = (updatedProduct) => {
        setInventoryItems(inventoryItems.map(item =>
            item.id === updatedProduct.id ? updatedProduct : item
        ));
        setIsViewProductOpen(false);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar activePage="inventory" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className="flex-1 min-w-[120px]">
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Inventory</h1>
                        <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">Manage your products and stock levels</p>
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

                        {/* Add Product Button */}
                        <button
                            onClick={() => setIsAddProductOpen(true)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="hidden xs:inline">Add Product</span>
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
                                            {stat.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Inventory Table */}
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                            {/* Table Header with Filters */}
                            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Product Inventory</h3>
                                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                    <div className="relative flex-1 sm:flex-initial min-w-[140px]">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by product or SKU..."
                                            className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-semibold text-[10px] sm:text-sm flex-shrink-0">
                                                            {item.product.split(' ').slice(0, 2).map(word => word[0]).join('')}
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">{item.product}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-600 font-mono">{item.sku}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-700">{item.category}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-700">{item.soldThisMonth}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <span className={`text-xs sm:text-sm font-medium ${item.availableStock === 0 ? 'text-red-600' :
                                                        item.availableStock <= 5 ? 'text-orange-600' :
                                                            item.availableStock <= 15 ? 'text-yellow-600' :
                                                                'text-green-600'
                                                        }`}>
                                                        {item.availableStock}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm font-medium text-gray-900">{item.revenue}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusDotColor(item.status)}`}></div>
                                                        <span className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <button
                                                        onClick={() => handleViewProduct(item)}
                                                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredItems.length === 0 && (
                                    <div className="text-center py-6 sm:py-8">
                                        <p className="text-sm text-gray-500">No products found matching your criteria</p>
                                    </div>
                                )}
                            </div>

                            {/* Table Footer */}
                            <div className="px-4 sm:px-5 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Showing {paginatedItems.length} of {filteredItems.length} products
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

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddProductOpen}
                onClose={() => setIsAddProductOpen(false)}
                onAddProduct={handleAddProduct}
            />

            {/* View Product Modal */}
            <ViewProductModal
                isOpen={isViewProductOpen}
                onClose={() => setIsViewProductOpen(false)}
                product={selectedProduct}
                onUpdateProduct={handleUpdateProduct}
            />
        </div>
    );
};

export default Inventory;