import React, { useState } from 'react';

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
    const [formData, setFormData] = useState({
        product: '',
        sku: '',
        category: 'Footwear',
        description: '',
        price: '',
        costPrice: '',
        availableStock: '',
        minStockLevel: '',
        soldThisMonth: '',
    });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.product.trim()) newErrors.product = 'Product name is required';
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
        if (!formData.availableStock || parseInt(formData.availableStock) < 0) {
            newErrors.availableStock = 'Available stock must be 0 or greater';
        }
        if (!formData.minStockLevel || parseInt(formData.minStockLevel) < 0) {
            newErrors.minStockLevel = 'Minimum stock level must be 0 or greater';
        }
        if (formData.costPrice && parseFloat(formData.costPrice) < 0) {
            newErrors.costPrice = 'Cost price must be 0 or greater';
        }
        if (formData.soldThisMonth && parseInt(formData.soldThisMonth) < 0) {
            newErrors.soldThisMonth = 'Sold this month must be 0 or greater';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const productData = {
                product: formData.product,
                sku: formData.sku,
                category: formData.category,
                description: formData.description,
                price: parseFloat(formData.price),
                costPrice: formData.costPrice ? parseFloat(formData.costPrice) : 0,
                availableStock: parseInt(formData.availableStock),
                minStockLevel: parseInt(formData.minStockLevel),
                soldThisMonth: formData.soldThisMonth ? parseInt(formData.soldThisMonth) : 0,
            };

            onAddProduct(productData);
            // Reset form
            setFormData({
                product: '',
                sku: '',
                category: 'Footwear',
                description: '',
                price: '',
                costPrice: '',
                availableStock: '',
                minStockLevel: '',
                soldThisMonth: '',
            });
            onClose();
        }
    };

    const generateSKU = () => {
        const prefix = formData.category.substring(0, 2).toUpperCase();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const sku = `${prefix}-${random}`;
        setFormData(prev => ({ ...prev, sku }));
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
                        <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Product Name and SKU */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="product"
                                    value={formData.product}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.product ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter product name"
                                />
                                {errors.product && (
                                    <p className="text-xs text-red-500 mt-1">{errors.product}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    SKU *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.sku ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter SKU"
                                    />
                                    <button
                                        type="button"
                                        onClick={generateSKU}
                                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm whitespace-nowrap"
                                    >
                                        Generate
                                    </button>
                                </div>
                                {errors.sku && (
                                    <p className="text-xs text-red-500 mt-1">{errors.sku}</p>
                                )}
                            </div>
                        </div>

                        {/* Category and Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white ${errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="Footwear">Footwear</option>
                                    <option value="Apparel">Apparel</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Others">Others</option>
                                </select>
                                {errors.category && (
                                    <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Brief description"
                                />
                            </div>
                        </div>

                        {/* Price and Cost Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Selling Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.price ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                                {errors.price && (
                                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cost Price (₹)
                                </label>
                                <input
                                    type="number"
                                    name="costPrice"
                                    value={formData.costPrice}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.costPrice ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                                {errors.costPrice && (
                                    <p className="text-xs text-red-500 mt-1">{errors.costPrice}</p>
                                )}
                            </div>
                        </div>

                        {/* Stock Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Available Stock *
                                </label>
                                <input
                                    type="number"
                                    name="availableStock"
                                    value={formData.availableStock}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.availableStock ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.availableStock && (
                                    <p className="text-xs text-red-500 mt-1">{errors.availableStock}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Min Stock Level *
                                </label>
                                <input
                                    type="number"
                                    name="minStockLevel"
                                    value={formData.minStockLevel}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.minStockLevel ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="10"
                                    min="0"
                                />
                                {errors.minStockLevel && (
                                    <p className="text-xs text-red-500 mt-1">{errors.minStockLevel}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sold This Month
                                </label>
                                <input
                                    type="number"
                                    name="soldThisMonth"
                                    value={formData.soldThisMonth}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.soldThisMonth ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.soldThisMonth && (
                                    <p className="text-xs text-red-500 mt-1">{errors.soldThisMonth}</p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;