import React, { useState } from 'react';

const ViewProductModal = ({ isOpen, onClose, product, onUpdateProduct }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(product || {});
    const [errors, setErrors] = useState({});

    if (!isOpen || !product) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.product?.trim()) newErrors.product = 'Product name is required';
        if (!formData.sku?.trim()) newErrors.sku = 'SKU is required';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
        if (!formData.availableStock || parseInt(formData.availableStock) < 0) {
            newErrors.availableStock = 'Available stock must be 0 or greater';
        }
        if (!formData.minStockLevel || parseInt(formData.minStockLevel) < 0) {
            newErrors.minStockLevel = 'Minimum stock level must be 0 or greater';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = () => {
        if (validateForm()) {
            // Determine status based on stock
            let status = 'Healthy';
            const stock = parseInt(formData.availableStock);
            const minStock = parseInt(formData.minStockLevel);

            if (stock === 0) {
                status = 'Out of Stock';
            } else if (stock <= minStock * 0.3) {
                status = 'Critical';
            } else if (stock <= minStock) {
                status = 'Low Stock';
            }

            const updatedProduct = {
                ...formData,
                status: status,
                revenue: `₹${(formData.soldThisMonth * formData.price).toLocaleString()}`,
            };

            onUpdateProduct(updatedProduct);
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData(product);
        setIsEditing(false);
        setErrors({});
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
                            <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
                            <p className="text-sm text-gray-500">{product.sku}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                                >
                                    Edit Product
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            )}
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Product Status */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getStatusDotColor(product.status)}`}></div>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(product.status)}`}>
                                    {product.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">
                                {product.status === 'Healthy' && '✓ Product is well stocked'}
                                {product.status === 'Low Stock' && '⚠️ Product is running low on stock'}
                                {product.status === 'Critical' && '🔴 Product stock is critically low'}
                                {product.status === 'Out of Stock' && '🚫 Product is out of stock'}
                            </div>
                        </div>

                        {/* Product Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Product Name</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="product"
                                        value={formData.product || ''}
                                        onChange={handleInputChange}
                                        className={`w-full mt-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.product ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                ) : (
                                    <p className="font-medium text-gray-800">{product.product}</p>
                                )}
                                {errors.product && (
                                    <p className="text-xs text-red-500 mt-1">{errors.product}</p>
                                )}
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">SKU</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku || ''}
                                        onChange={handleInputChange}
                                        className={`w-full mt-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.sku ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                ) : (
                                    <p className="font-medium text-gray-800 font-mono">{product.sku}</p>
                                )}
                                {errors.sku && (
                                    <p className="text-xs text-red-500 mt-1">{errors.sku}</p>
                                )}
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Category</p>
                                {isEditing ? (
                                    <select
                                        name="category"
                                        value={formData.category || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        <option value="Footwear">Footwear</option>
                                        <option value="Apparel">Apparel</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Others">Others</option>
                                    </select>
                                ) : (
                                    <p className="font-medium text-gray-800">{product.category}</p>
                                )}
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Description</p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-800">{product.description || 'N/A'}</p>
                                )}
                            </div>
                        </div>

                        {/* Pricing and Stock */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Selling Price</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price || ''}
                                        onChange={handleInputChange}
                                        className={`w-full mt-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.price ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        min="0"
                                        step="0.01"
                                    />
                                ) : (
                                    <p className="text-lg font-bold text-gray-800">₹{product.price.toLocaleString()}</p>
                                )}
                                {errors.price && (
                                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                                )}
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Cost Price</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="costPrice"
                                        value={formData.costPrice || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        min="0"
                                        step="0.01"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-800">₹{product.costPrice.toLocaleString()}</p>
                                )}
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Available Stock</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="availableStock"
                                        value={formData.availableStock || ''}
                                        onChange={handleInputChange}
                                        className={`w-full mt-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.availableStock ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        min="0"
                                    />
                                ) : (
                                    <p className={`text-lg font-bold ${product.availableStock === 0 ? 'text-red-600' :
                                            product.availableStock <= 5 ? 'text-orange-600' :
                                                product.availableStock <= 15 ? 'text-yellow-600' :
                                                    'text-green-600'
                                        }`}>
                                        {product.availableStock}
                                    </p>
                                )}
                                {errors.availableStock && (
                                    <p className="text-xs text-red-500 mt-1">{errors.availableStock}</p>
                                )}
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Min Stock Level</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="minStockLevel"
                                        value={formData.minStockLevel || ''}
                                        onChange={handleInputChange}
                                        className={`w-full mt-1 px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.minStockLevel ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        min="0"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-800">{product.minStockLevel}</p>
                                )}
                                {errors.minStockLevel && (
                                    <p className="text-xs text-red-500 mt-1">{errors.minStockLevel}</p>
                                )}
                            </div>
                        </div>

                        {/* Sales Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Sold This Month</p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="soldThisMonth"
                                        value={formData.soldThisMonth || ''}
                                        onChange={handleInputChange}
                                        className="w-full mt-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        min="0"
                                    />
                                ) : (
                                    <p className="text-lg font-bold text-gray-800">{product.soldThisMonth}</p>
                                )}
                            </div>
                            <div className="p-4 border border-gray-200 rounded-xl">
                                <p className="text-sm text-gray-500">Total Revenue</p>
                                <p className="text-lg font-bold text-gray-800">{product.revenue}</p>
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProductModal;