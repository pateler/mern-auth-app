import React, { useState } from 'react';

const ViewTeamMemberModal = ({ isOpen, onClose, member, onUpdateMember }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(member || {});
    const [errors, setErrors] = useState({});

    if (!isOpen || !member) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.role) newErrors.role = 'Role is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = () => {
        if (validateForm()) {
            onUpdateMember(formData);
            setIsEditing(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Active': 'bg-green-500',
            'Suspended': 'bg-red-500',
            'Pending': 'bg-yellow-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    const getStatusTextColor = (status) => {
        const colors = {
            'Active': 'text-green-600',
            'Suspended': 'text-red-600',
            'Pending': 'text-yellow-600',
        };
        return colors[status] || 'text-gray-600';
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Team Member Details</h2>
                            <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(member.status)}`}></div>
                            <span className={`font-medium ${getStatusTextColor(member.status)}`}>
                                {member.status}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">• Last active: {member.lastActive}</span>
                        </div>

                        {/* Member Info */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                ) : (
                                    <p className="text-gray-800 font-medium">{member.name}</p>
                                )}
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                ) : (
                                    <p className="text-gray-600">{member.email}</p>
                                )}
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                {isEditing ? (
                                    <select
                                        name="role"
                                        value={formData.role || ''}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white ${errors.role ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Super Admin">Super Admin</option>
                                        <option value="Manager">Manager</option>
                                        <option value="User">User</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-600">{member.role}</p>
                                )}
                                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Access</label>
                                {isEditing ? (
                                    <select
                                        name="access"
                                        value={formData.access || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        <option value="Full">Full</option>
                                        <option value="Orders + Inventory">Orders + Inventory</option>
                                        <option value="Orders Only">Orders Only</option>
                                        <option value="Inventory Only">Inventory Only</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-600">{member.access}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                {isEditing ? (
                                    <select
                                        name="status"
                                        value={formData.status || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                                        <span className={`font-medium ${getStatusTextColor(member.status)}`}>
                                            {member.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setFormData(member);
                                            setIsEditing(false);
                                            setErrors({});
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Edit Member
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewTeamMemberModal;