import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AddTeamMemberModal from './AddTeamMemberModal';
import ViewTeamMemberModal from './ViewTeamMemberModal';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [formData, setFormData] = useState({
        companyName: 'Digital Tech Solutions',
        contactNumber: '+918308261669',
        businessAddress: '6565 Fannin St, Houston, TX 77030, Pune, Maharashtra',
        timezone: 'Asia/Kolkata (IST)',
        currency: 'INR - Indian Rupees'
    });

    // Notification preferences state
    const [notifications, setNotifications] = useState({
        emailNewOrders: true,
        emailRefunds: true,
        emailChat: true,
        emailFailedPayments: true,
        pushBrowser: true,
        pushMobile: false,
        smsOrderConfirmations: true,
        smsDeliveryUpdates: false,
    });

    // Security state
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [activeSessions, setActiveSessions] = useState([
        { id: 1, device: 'Chrome On Windows', location: 'Pune, India', ip: '103.45.67.879', isCurrent: true },
        { id: 2, device: 'Firefox On MacOS', location: 'Bangaluru, India', ip: '103.45.67.879', isCurrent: false },
    ]);

    // Team members state with dynamic management
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, name: 'Aman Shah', email: 'aman@example.com', role: 'Super Admin', access: 'Full', lastActive: 'Online', status: 'Active' },
        { id: 2, name: 'Abhishek Borude', email: 'abhishek@example.com', role: 'Admin', access: 'Orders + Inventory', lastActive: '8 days ago', status: 'Active' },
        { id: 3, name: 'Sanket Patil', email: 'sanket@example.com', role: 'Super Admin', access: 'Full', lastActive: '2 mins ago', status: 'Active' },
        { id: 4, name: 'Zainab Khan', email: 'zainab@example.com', role: 'Admin', access: 'Orders + Inventory', lastActive: 'Today, 11:17am', status: 'Active' },
        { id: 5, name: 'Paramveer Singh', email: 'paramveer@example.com', role: 'Admin', access: 'Full', lastActive: '2 mins ago', status: 'Suspended' },
        { id: 6, name: 'Nizam Dalal', email: 'nizam@example.com', role: 'Admin', access: 'Orders + Inventory', lastActive: '2 mins ago', status: 'Active' },
        { id: 7, name: 'Yasmeen Shaikh', email: 'yasmeen@example.com', role: 'Admin', access: 'Full', lastActive: '2 mins ago', status: 'Active' },
        { id: 8, name: 'Pankaj Jangid', email: 'pankaj@example.com', role: 'Admin', access: 'Full', lastActive: 'Never Logged In', status: 'Pending' },
    ]);

    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [isViewMemberOpen, setIsViewMemberOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [teamSearchQuery, setTeamSearchQuery] = useState('');
    const [teamCurrentPage, setTeamCurrentPage] = useState(1);
    const teamItemsPerPage = 5;

    // Invoice history state
    const [invoices] = useState([
        { id: 'Inv-2026-05', date: '1 May, 2026', amount: '₹4,999', status: 'Paid' },
        { id: 'Inv-2026-04', date: '1 April, 2026', amount: '₹4,999', status: 'Paid' },
        { id: 'Inv-2026-03', date: '1 March, 2026', amount: '₹4,999', status: 'Paid' },
    ]);

    // Audit logs state with dynamic data
    const [auditLogs] = useState([
        { user: 'Aman Shah', action: 'Updated inventory', module: 'Full', timestamp: '2 mins ago', device: 'Chrome', ip: '103.45.67.89' },
        { user: 'Abhishek Borude', action: 'Processed refund', module: 'Orders + Inventory', timestamp: '27 mins ago', device: 'Safari on Mac', ip: '103.45.67.89' },
        { user: 'Sanket Patil', action: 'Changed Permissions', module: 'Full', timestamp: '1 hour ago', device: 'Firefox', ip: '103.45.67.89' },
        { user: 'Zainab Khan', action: 'Imported sales report', module: 'Orders + Inventory', timestamp: '2 hours ago', device: 'Chrome', ip: '103.45.67.89' },
        { user: 'Paramveer Singh', action: 'Updated billing details', module: 'Full', timestamp: '3 hours ago', device: 'Safari', ip: '103.45.67.89' },
        { user: 'Nizam Dalal', action: 'Accepted Order', module: 'Orders + Inventory', timestamp: '4 hours ago', device: 'Safari', ip: '103.45.67.89' },
        { user: 'Saurabh Chaudhari', action: 'Inventory updated', module: 'Full', timestamp: '5 hours ago', device: 'Chrome', ip: '103.45.67.89' },
        { user: 'Pankaj Jangid', action: 'Cleared notifications', module: 'Full', timestamp: '7 Days ago', device: 'Chrome', ip: '103.45.67.89' },
    ]);

    // API Integrations state with dynamic management
    const [integrations, setIntegrations] = useState([
        { id: 1, name: 'WooCommerce', status: 'connected', lastSynced: '2 Mins Ago', color: 'bg-purple-500' },
        { id: 2, name: 'Shiprocket', status: 'connected', lastSynced: '2 Mins Ago', color: 'bg-blue-500' },
        { id: 3, name: 'Razorpay', status: 'connected', lastSynced: '2 Mins Ago', color: 'bg-indigo-500' },
        { id: 4, name: 'WhatsApp API', status: 'disconnected', lastSynced: '2 Mins Ago', color: 'bg-green-500' },
        { id: 5, name: 'Meta Ads', status: 'disconnected', lastSynced: '2 Mins Ago', color: 'bg-blue-600' },
    ]);

    // Sections configuration
    const sections = [
        { id: 'general', label: 'General', icon: '⚙️' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'security', label: 'Security', icon: '🔒' },
        { id: 'team', label: 'Team Management', icon: '👥' },
        { id: 'billing', label: 'Billing', icon: '💳' },
        { id: 'api', label: 'API & Integrations', icon: '🔗' },
        { id: 'audit', label: 'Audit Logs', icon: '📋' },
    ];

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

    // Filter team members
    const filteredTeamMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(teamSearchQuery.toLowerCase())
    );

    // Team pagination
    const teamTotalPages = Math.ceil(filteredTeamMembers.length / teamItemsPerPage);
    const teamStartIndex = (teamCurrentPage - 1) * teamItemsPerPage;
    const paginatedTeamMembers = filteredTeamMembers.slice(teamStartIndex, teamStartIndex + teamItemsPerPage);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    const handleUpdatePassword = () => {
        const errors = {};
        if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
        if (!passwordData.newPassword) errors.newPassword = 'New password is required';
        if (passwordData.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters';
        if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }

        alert('Password updated successfully!');
        setShowChangePassword(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setPasswordErrors({});
    };

    const handleLogoutAllDevices = () => {
        if (window.confirm('Are you sure you want to logout from all devices?')) {
            setActiveSessions([]);
            alert('Logged out from all devices successfully!');
        }
    };

    const handleLogoutSession = (sessionId) => {
        setActiveSessions(activeSessions.filter(session => session.id !== sessionId));
        alert('Session logged out successfully!');
    };

    const handleEnable2FA = () => {
        setIs2FAEnabled(!is2FAEnabled);
        alert(is2FAEnabled ? 'Two-Factor Authentication disabled!' : 'Two-Factor Authentication enabled successfully!');
    };

    const handleUpgradePlan = () => {
        alert('Upgrade plan dialog opened!');
    };

    const handleUpdatePayment = () => {
        alert('Update payment method dialog opened!');
    };

    const handleAddTeamMember = (memberData) => {
        const newId = Math.max(...teamMembers.map(m => m.id)) + 1;
        const newMember = {
            ...memberData,
            id: newId,
            lastActive: 'Just now',
            status: 'Active',
        };
        setTeamMembers([newMember, ...teamMembers]);
        setIsAddMemberOpen(false);
    };

    const handleViewTeamMember = (member) => {
        setSelectedMember(member);
        setIsViewMemberOpen(true);
    };

    const handleUpdateTeamMember = (updatedMember) => {
        setTeamMembers(teamMembers.map(member =>
            member.id === updatedMember.id ? updatedMember : member
        ));
        setIsViewMemberOpen(false);
    };

    const handleSyncNow = (integrationId) => {
        setIntegrations(integrations.map(integration =>
            integration.id === integrationId
                ? { ...integration, lastSynced: 'Just now' }
                : integration
        ));
        const integration = integrations.find(i => i.id === integrationId);
        alert(`Syncing ${integration.name}...`);
    };

    const handleDisconnect = (integrationId) => {
        if (window.confirm('Are you sure you want to disconnect this integration?')) {
            setIntegrations(integrations.map(integration =>
                integration.id === integrationId
                    ? { ...integration, status: 'disconnected' }
                    : integration
            ));
            const integration = integrations.find(i => i.id === integrationId);
            alert(`Disconnected ${integration.name}`);
        }
    };

    const handleConnect = (integrationId) => {
        setIntegrations(integrations.map(integration =>
            integration.id === integrationId
                ? { ...integration, status: 'connected' }
                : integration
        ));
        const integration = integrations.find(i => i.id === integrationId);
        alert(`Connected ${integration.name}`);
    };

    const handleManageAPIKeys = () => {
        alert('Managing API Keys...');
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all settings?')) {
            setFormData({
                companyName: 'Digital Tech Solutions',
                contactNumber: '+918308261669',
                businessAddress: '6565 Fannin St, Houston, TX 77030, Pune, Maharashtra',
                timezone: 'Asia/Kolkata (IST)',
                currency: 'INR - Indian Rupees'
            });
            alert('Settings reset successfully!');
        }
    };

    const handleTeamPageChange = (page) => {
        if (page >= 1 && page <= teamTotalPages) {
            setTeamCurrentPage(page);
        }
    };

    // Render content based on active section
    const renderContent = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">General Settings</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your business and account preferences</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Company name
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Contact number
                                </label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Business Address
                                </label>
                                <textarea
                                    name="businessAddress"
                                    value={formData.businessAddress}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-sm sm:text-base"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Timezone
                                    </label>
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-sm sm:text-base"
                                    >
                                        <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                                        <option value="America/New_York (EST)">America/New_York (EST)</option>
                                        <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                                        <option value="Asia/Dubai (GST)">Asia/Dubai (GST)</option>
                                        <option value="Australia/Sydney (AEST)">Australia/Sydney (AEST)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Currency
                                    </label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-sm sm:text-base"
                                    >
                                        <option value="INR - Indian Rupees">INR - Indian Rupees</option>
                                        <option value="USD - US Dollars">USD - US Dollars</option>
                                        <option value="EUR - Euros">EUR - Euros</option>
                                        <option value="GBP - British Pounds">GBP - British Pounds</option>
                                        <option value="AED - UAE Dirham">AED - UAE Dirham</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={handleSave}
                                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Notifications & Preferences</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage how you receive updates and alerts</p>
                        </div>

                        {/* Email Notifications */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">E-Mail Notifications</h4>
                            <div className="space-y-3">
                                {[
                                    { key: 'emailNewOrders', title: 'New Orders', desc: 'Receive an email when a new order is placed' },
                                    { key: 'emailRefunds', title: 'Refunds', desc: 'Receive email updates for refunds' },
                                    { key: 'emailChat', title: 'Chat', desc: 'Receive email updates for chats' },
                                    { key: 'emailFailedPayments', title: 'Failed Payments', desc: 'Receive an email updates for failed payments' }
                                ].map((item) => (
                                    <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3 sm:gap-0">
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm sm:text-base">{item.title}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notifications[item.key]}
                                                onChange={() => handleNotificationToggle(item.key)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Push Notifications */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Push Notifications</h4>
                            <div className="space-y-3">
                                {[
                                    { key: 'pushBrowser', title: 'Browser Notifications', desc: 'Get instant browser push notifications' },
                                    { key: 'pushMobile', title: 'Mobile Notifications', desc: 'Get instant mobile push notifications' }
                                ].map((item) => (
                                    <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3 sm:gap-0">
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm sm:text-base">{item.title}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notifications[item.key]}
                                                onChange={() => handleNotificationToggle(item.key)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WhatsApp/SMS Notifications */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">WhatsApp/SMS Notifications</h4>
                            <div className="space-y-3">
                                {[
                                    { key: 'smsOrderConfirmations', title: 'Order Confirmations', desc: 'Send order confirmations via WhatsApp/SMS' },
                                    { key: 'smsDeliveryUpdates', title: 'Delivery Updates', desc: 'Send delivery updates via WhatsApp/SMS' }
                                ].map((item) => (
                                    <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3 sm:gap-0">
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm sm:text-base">{item.title}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notifications[item.key]}
                                                onChange={() => handleNotificationToggle(item.key)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={handleSave}
                                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Security Settings</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your account security and authentication</p>
                        </div>

                        {/* Change Password */}
                        <div className="border border-gray-200 rounded-xl p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">Change Password</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Update your password to keep your account secure</p>
                                </div>
                                <button
                                    onClick={() => setShowChangePassword(!showChangePassword)}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                                >
                                    {showChangePassword ? 'Cancel' : 'Change Password'}
                                </button>
                            </div>

                            {showChangePassword && (
                                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter current password"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {passwordErrors.currentPassword && (
                                            <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {passwordErrors.newPassword && (
                                            <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm new password"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                        {passwordErrors.confirmPassword && (
                                            <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleUpdatePassword}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Two-Factor Authentication */}
                        <div className="border border-gray-200 rounded-xl p-4 sm:p-5">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">Two-Factor Authentication</h4>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Enable extra protection with a code sent to your device</p>
                                </div>
                                <button
                                    onClick={handleEnable2FA}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors ${is2FAEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                </button>
                            </div>
                            {is2FAEnabled && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-700">✓ Two-Factor Authentication is enabled</p>
                                </div>
                            )}
                        </div>

                        {/* Active Sessions */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Active Sessions</h4>
                            <div className="space-y-3">
                                {activeSessions.map((session) => (
                                    <div key={session.id} className={`border border-gray-200 rounded-xl p-4 ${session.isCurrent ? 'bg-gray-50' : 'bg-white'}`}>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <svg className={`w-5 h-5 ${session.isCurrent ? 'text-blue-600' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                                                    </svg>
                                                    <p className="font-medium text-gray-800 text-sm sm:text-base">{session.device}</p>
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">{session.location} | ({session.ip})</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {session.isCurrent && (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Current</span>
                                                )}
                                                {!session.isCurrent && (
                                                    <button
                                                        onClick={() => handleLogoutSession(session.id)}
                                                        className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        Logout
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {activeSessions.length === 0 && (
                                    <div className="text-center py-4 text-gray-500">No active sessions found</div>
                                )}
                            </div>
                        </div>

                        {/* Last Login Activity */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Last Login Activity</h4>
                            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">Last Successful Login</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Today at 9:45 AM from Pune, India | (103.45.67.879)</p>
                                    </div>
                                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={handleLogoutAllDevices}
                                className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                            >
                                Logout All Devices
                            </button>
                        </div>
                    </div>
                );

            case 'team':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Team Management</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your team members and permissions</p>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                            <div className="relative w-full sm:flex-1 max-w-xs sm:max-w-md">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    value={teamSearchQuery}
                                    onChange={(e) => setTeamSearchQuery(e.target.value)}
                                    placeholder="Search by name, email or role..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    <span className="hidden xs:inline">Filter</span>
                                </button>
                                <button
                                    onClick={() => setIsAddMemberOpen(true)}
                                    className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm flex items-center gap-1 flex-shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="hidden xs:inline">Invite +</span>
                                    <span className="xs:hidden">Invite</span>
                                </button>
                            </div>
                        </div>

                        {/* Team Members Table */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[640px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Last active</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedTeamMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-[10px] sm:text-xs flex-shrink-0">
                                                            {member.name.split(' ').map(word => word[0]).join('')}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <span className="text-xs sm:text-sm font-medium text-gray-800 truncate block">{member.name}</span>
                                                            <p className="text-[10px] sm:text-xs text-gray-500 truncate">{member.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-700">{member.role}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-600">{member.access}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-500">{member.lastActive}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                                                        <span className={`text-xs sm:text-sm font-medium ${getStatusTextColor(member.status)}`}>
                                                            {member.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <button
                                                        onClick={() => handleViewTeamMember(member)}
                                                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredTeamMembers.length === 0 && (
                                    <div className="text-center py-6 sm:py-8">
                                        <p className="text-sm text-gray-500">No team members found matching your criteria</p>
                                    </div>
                                )}
                            </div>

                            {/* Table Footer */}
                            <div className="px-4 sm:px-5 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Showing {paginatedTeamMembers.length} of {filteredTeamMembers.length} members
                                </p>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        onClick={() => handleTeamPageChange(teamCurrentPage - 1)}
                                        disabled={teamCurrentPage === 1}
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: teamTotalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handleTeamPageChange(page)}
                                            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded-lg transition-colors ${teamCurrentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleTeamPageChange(teamCurrentPage + 1)}
                                        disabled={teamCurrentPage === teamTotalPages || teamTotalPages === 0}
                                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'billing':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Billing</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your subscription and billing details</p>
                        </div>

                        {/* Current Plan */}
                        <div className="border border-gray-200 rounded-xl p-4 sm:p-5">
                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Current Plan</h4>
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                                    <span className="text-gray-600 text-sm">Monthly cost</span>
                                    <span className="font-semibold text-gray-800 text-sm sm:text-base">₹4,999</span>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                                    <span className="text-gray-600 text-sm">Next Renewal</span>
                                    <span className="font-semibold text-gray-800 text-sm sm:text-base">1 June, 2026</span>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    onClick={handleUpgradePlan}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                                >
                                    Upgrade Plan
                                </button>
                                <button
                                    onClick={handleUpdatePayment}
                                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium rounded-lg transition-colors"
                                >
                                    Update Payment Method
                                </button>
                            </div>
                        </div>

                        {/* Invoice History */}
                        <div>
                            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-4">Invoice History</h4>
                            <div className="space-y-3">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm sm:text-base">{invoice.id}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">{invoice.date}</p>
                                        </div>
                                        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                                            <span className="font-semibold text-gray-800 text-sm sm:text-base">{invoice.amount}</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-medium rounded-full">
                                                {invoice.status}
                                            </span>
                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'api':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">API & Integrations</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage third party integrations and API access</p>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                            <div className="relative w-full sm:flex-1 max-w-xs sm:max-w-md">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search integrations..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    1 Mar 2026 ▼
                                </button>
                                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    31 Mar 2026 ▼
                                </button>
                                <button
                                    onClick={handleManageAPIKeys}
                                    className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm"
                                >
                                    Manage API Keys
                                </button>
                            </div>
                        </div>

                        {/* Integrations List */}
                        <div className="space-y-3">
                            {integrations.map((integration) => (
                                <div key={integration.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg ${integration.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                            {integration.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm sm:text-base">{integration.name}</p>
                                            <p className="text-xs sm:text-sm text-gray-500">Last Synced {integration.lastSynced}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {integration.status === 'connected' ? (
                                            <>
                                                <button
                                                    onClick={() => handleDisconnect(integration.id)}
                                                    className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    Disconnect
                                                </button>
                                                <button
                                                    onClick={() => handleSyncNow(integration.id)}
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    Sync now
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleConnect(integration.id)}
                                                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Connect
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'audit':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Audit Logs</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Track all administrative actions and system events</p>
                        </div>

                        {/* Search and Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                            <div className="relative w-full sm:flex-1 max-w-xs sm:max-w-md">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search logs..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    1 Mar 2026 ▼
                                </button>
                                <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    31 Mar 2026 ▼
                                </button>
                                <button className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm">
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Audit Logs Table */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                            <th className="px-3 sm:px-5 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {auditLogs.map((log, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-semibold text-[8px] sm:text-xs flex-shrink-0">
                                                            {log.user.split(' ').map(word => word[0]).join('')}
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-medium text-gray-800">{log.user}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-700">{log.action}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-600">{log.module}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-500">{log.timestamp}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm text-gray-600">{log.device}</td>
                                                <td className="px-3 sm:px-5 py-2 sm:py-3.5 text-xs sm:text-sm font-mono text-gray-500">{log.ip}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="px-4 sm:px-5 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    Showing {auditLogs.length} of {auditLogs.length} entries
                                </p>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                                        Previous
                                    </button>
                                    <button className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        1
                                    </button>
                                    <button className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        2
                                    </button>
                                    <button className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar activePage="settings" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0">
                    <div className="flex-1 min-w-[120px]">
                        <h1 className="text-base sm:text-xl font-semibold text-gray-800">Settings</h1>
                        <p className="text-xs sm:text-sm text-gray-500 hidden xs:block">Manage your account and business preferences</p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap ml-auto">
                        <button
                            onClick={handleReset}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-xs sm:text-sm"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="hidden xs:inline">Save Changes</span>
                            <span className="xs:hidden">Save</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                            {/* Sidebar Navigation */}
                            <div className="md:w-64 flex-shrink-0">
                                <div className="bg-white rounded-2xl border border-gray-200 p-2 sticky top-6">
                                    <nav className="space-y-1">
                                        {sections.map((section) => (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm ${activeSection === section.id
                                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="text-lg">{section.icon}</span>
                                                <span className="text-xs sm:text-sm truncate">{section.label}</span>
                                                {activeSection === section.id && (
                                                    <div className="ml-auto w-1.5 h-6 bg-blue-600 rounded-full flex-shrink-0"></div>
                                                )}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 min-w-0">
                                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                                    {renderContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Team Member Modal */}
            <AddTeamMemberModal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                onAddMember={handleAddTeamMember}
            />

            {/* View Team Member Modal */}
            <ViewTeamMemberModal
                isOpen={isViewMemberOpen}
                onClose={() => setIsViewMemberOpen(false)}
                member={selectedMember}
                onUpdateMember={handleUpdateTeamMember}
            />
        </div>
    );
};

export default Settings;