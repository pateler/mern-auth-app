import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import SearchModal from './SearchModal';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('12 months');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [currentValue, setCurrentValue] = useState({ month: 'Dec', value: '£150,000' });
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New order received', message: 'Order #ORD-1024 has been placed', time: '2 mins ago', read: false },
    { id: 2, title: 'Payment confirmed', message: 'Payment for order #ORD-1023 has been confirmed', time: '15 mins ago', read: false },
    { id: 3, title: 'Low stock alert', message: 'Product "iPhone 15 Case" is running low on stock', time: '1 hour ago', read: true },
    { id: 4, title: 'New customer message', message: 'Sufyan Shaikh sent a message about order #ORD-1024', time: '2 hours ago', read: true },
  ]);
  const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length);

  // Mock data for dashboard
  const stats = [
    {
      label: 'Total Orders',
      value: '1,245',
      change: '+12%',
      changeLabel: 'This month',
      changeType: 'positive',
      icon: '📦',
      color: 'bg-blue-500'
    },
    {
      label: 'Revenue',
      value: '£4,32,500',
      change: '+16%',
      changeLabel: 'This month',
      changeType: 'positive',
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      label: 'Pending Orders',
      value: '18',
      change: '-8%',
      changeLabel: 'This week',
      changeType: 'negative',
      icon: '⏳',
      color: 'bg-orange-500'
    },
    {
      label: 'Conversion Rate',
      value: '3.8%',
      change: '+0.6%',
      changeLabel: 'This month',
      changeType: 'positive',
      icon: '📊',
      color: 'bg-purple-500'
    },
  ];

  const recentOrders = [
    { id: '#ORD-1024', customer: 'Sufyan Shaikh', date: 'May 6, 2026', status: 'Processing', payment: 'Paid', amount: '£2,400' },
    { id: '#ORD-1023', customer: 'Sanket Patil', date: 'May 5, 2026', status: 'Completed', payment: 'Pending', amount: '£1,800' },
    { id: '#ORD-1022', customer: 'Saurabh Chaudhari', date: 'May 5, 2026', status: 'Completed', payment: 'Completed', amount: '£3,200' },
    { id: '#ORD-1021', customer: 'Abhishek Borude', date: 'May 4, 2026', status: 'Cancelled', payment: 'Refunded', amount: '£3,200' },
    { id: '#ORD-1020', customer: 'Pankaj Jangid', date: 'May 3, 2026', status: 'Completed', payment: 'COD', amount: '£3,200' },
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

  // Traffic sources data
  const trafficSources = [
    { name: 'Direct', value: 1341, percentage: 76.1, color: 'bg-blue-500' },
    { name: 'Meta Ads', value: 217, percentage: 13.4, color: 'bg-green-500' },
    { name: 'Google Maps', value: 124, percentage: 6.2, color: 'bg-orange-500' },
    { name: 'Organic Search', value: 53, percentage: 3.4, color: 'bg-purple-500' },
  ];

  // Generate chart data based on period
  const generateChartData = (period) => {
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const allData = [80, 120, 100, 140, 110, 130, 150, 120, 160, 140, 130, 150];

    let months, data;
    const currentMonthIndex = new Date().getMonth();

    switch (period) {
      case '7 days':
        months = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [45, 67, 89, 120, 95, 110, 88];
        setCurrentValue({ month: 'Today', value: '£88,000' });
        break;
      case '30 days':
        months = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [320, 450, 380, 520];
        setCurrentValue({ month: 'Week 4', value: '£520,000' });
        break;
      case '6 months':
        months = allMonths.slice(currentMonthIndex - 5, currentMonthIndex + 1);
        data = allData.slice(currentMonthIndex - 5, currentMonthIndex + 1);
        setCurrentValue({
          month: months[months.length - 1],
          value: `£${(data[data.length - 1] * 1000).toLocaleString()}`
        });
        break;
      case '12 months':
      default:
        months = allMonths;
        data = allData;
        setCurrentValue({
          month: 'Dec',
          value: '£150,000'
        });
        break;
    }

    const max = Math.max(...data);
    return { months, data, max };
  };

  // Update chart data when period changes
  useEffect(() => {
    const { months, data, max } = generateChartData(activePeriod);
    setChartData(data);
    setMaxValue(max);
  }, [activePeriod]);

  // Initialize chart data
  useEffect(() => {
    const { months, data, max } = generateChartData('12 months');
    setChartData(data);
    setMaxValue(max);
  }, []);

  const handleViewOrder = (orderId) => {
    navigate(`/orders?view=${orderId}`);
  };

  const handleViewAllOrders = () => {
    navigate('/orders');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearchOpen(false);
    console.log('Searching for:', query);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(notifications.filter(n => n.id !== id && !n.read).length);
  };

  // Get month labels based on period
  const getMonthLabels = () => {
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIndex = new Date().getMonth();

    switch (activePeriod) {
      case '7 days':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case '30 days':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      case '6 months':
        return allMonths.slice(currentMonthIndex - 5, currentMonthIndex + 1);
      case '12 months':
      default:
        return allMonths;
    }
  };

  const monthLabels = getMonthLabels();

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = () => {
      setIsNotificationOpen(false);
      setIsProfileOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Search functionality
  const filteredOrders = recentOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout */}
      <div className="flex h-screen overflow-hidden">
        <Sidebar activePage="dashboard" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search by order ID, Customer, Phone"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsProfileOpen(false);
                  }}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <NotificationDropdown
                    notifications={notifications}
                    onMarkAllRead={handleMarkAllRead}
                    onNotificationClick={handleNotificationClick}
                    onClose={() => setIsNotificationOpen(false)}
                  />
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationOpen(false);
                  }}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <ProfileDropdown onClose={() => setIsProfileOpen(false)} />
                )}
              </div>
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
                      <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center text-white text-xl flex-shrink-0`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Revenue Chart - Takes 2/3 of space */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Revenue report</h3>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <span>Revenue report</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Period Selector */}
                  <div className="flex gap-1 mb-6">
                    {['12 months', '6 months', '30 days', '7 days'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setActivePeriod(period)}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${activePeriod === period
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>

                  {/* Bar Chart */}
                  <div className="relative pl-8">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-400">
                      <span>£200k</span>
                      <span>£150k</span>
                      <span>£100k</span>
                      <span>£50k</span>
                      <span>£0</span>
                    </div>

                    <div className="h-56 flex items-end gap-2 pb-6 ml-4">
                      {chartData.map((value, index) => {
                        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                        const isLast = index === chartData.length - 1;
                        const isFirst = index === 0;

                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-1">
                            <div className="relative w-full group">
                              <div
                                className={`w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-300 cursor-pointer ${isLast ? 'bg-blue-600' : ''
                                  }`}
                                style={{
                                  height: `${Math.max(height, 4)}%`,
                                  minHeight: '4px',
                                  transition: 'height 0.5s ease'
                                }}
                              >
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                    £{(value * 1000).toLocaleString()}
                                  </div>
                                  <div className="w-2 h-2 bg-gray-800 rotate-45 mx-auto -mt-1"></div>
                                </div>
                              </div>
                            </div>
                            <span className={`text-xs ${isLast ? 'text-blue-600 font-semibold' : 'text-gray-500'
                              }`}>
                              {monthLabels[index]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Current value indicator */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                      <span className="text-sm font-semibold text-gray-800">{currentValue.month}</span>
                      <span className="text-sm font-bold text-blue-600 ml-2">{currentValue.value}</span>
                    </div>
                  </div>
                </div>

                {/* Traffic Sources - Takes 1/3 of space */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Traffic Sources</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800">1735</span>
                      <span className="text-sm text-gray-500 ml-1">Clicks</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {trafficSources.map((source) => (
                      <div key={source.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700">{source.name}</span>
                          <span className="text-sm text-gray-500">
                            {source.value}
                            <span className="ml-1 text-xs text-gray-400">({source.percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${source.color} rounded-full transition-all duration-500`}
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                  <button
                    onClick={handleViewAllOrders}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all
                  </button>
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
                      {(searchQuery ? filteredOrders : recentOrders).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
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
                            <button
                              onClick={() => handleViewOrder(order.id)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {searchQuery && filteredOrders.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No orders found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSearch={handleSearch}
        />
      )}
    </div>
  );
};

export default Dashboard;