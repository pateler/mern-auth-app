import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import SearchModal from './SearchModal';

// Chart geometry (logical SVG units — the <svg> scales responsively via viewBox)
const CHART_WIDTH = 760;
const CHART_HEIGHT = 240;
const PADDING = { left: 48, right: 12, top: 16, bottom: 28 };

// Builds a smooth Catmull-Rom -> cubic-bezier path through a list of {x, y} points
function buildSmoothPath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return d;
}

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const svgRef = useRef(null);

  const [activePeriod, setActivePeriod] = useState('12 months');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [monthLabels, setMonthLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);

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

  // Generate chart data (current + comparison/previous period) based on the selected period
  const generateChartData = (period) => {
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const allData = [80, 120, 100, 140, 110, 130, 150, 120, 160, 140, 130, 150];
    const allComparison = [50, 65, 60, 90, 85, 95, 100, 90, 95, 105, 110, 115];

    let months, data, comparison;
    const currentMonthIndex = new Date().getMonth();

    switch (period) {
      case '7 days':
        months = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        data = [45, 67, 89, 120, 95, 110, 88];
        comparison = [30, 40, 55, 80, 70, 85, 75];
        break;
      case '30 days':
        months = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [320, 450, 380, 520];
        comparison = [200, 280, 260, 340];
        break;
      case '6 months':
        months = allMonths.slice(currentMonthIndex - 5, currentMonthIndex + 1);
        data = allData.slice(currentMonthIndex - 5, currentMonthIndex + 1);
        comparison = allComparison.slice(currentMonthIndex - 5, currentMonthIndex + 1);
        break;
      case '12 months':
      default:
        months = allMonths;
        data = allData;
        comparison = allComparison;
        break;
    }

    const rawMax = Math.max(...data, ...comparison);
    const niceMax = Math.ceil(rawMax / 50) * 50 || 50;

    return { months, data, comparison, niceMax };
  };

  // Update chart data whenever the period changes (also runs on mount)
  useEffect(() => {
    const { months, data, comparison, niceMax } = generateChartData(activePeriod);
    setMonthLabels(months);
    setChartData(data);
    setComparisonData(comparison);
    setMaxValue(niceMax);
    setHoverIndex(data.length > 0 ? Math.floor((data.length - 1) / 2) : null);
  }, [activePeriod]);

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

  // ---- Chart geometry helpers ----
  const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const xStep = chartData.length > 1 ? plotWidth / (chartData.length - 1) : 0;

  const getX = (i) => PADDING.left + i * xStep;
  const getY = (v) => PADDING.top + (1 - (maxValue > 0 ? v / maxValue : 0)) * plotHeight;

  const gridValues = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(maxValue * f));

  const mainPath = buildSmoothPath(chartData.map((v, i) => ({ x: getX(i), y: getY(v) })));
  const comparisonPath = buildSmoothPath(comparisonData.map((v, i) => ({ x: getX(i), y: getY(v) })));

  const currentYear = new Date().getFullYear();

  const handleChartMouseMove = (e) => {
    const svg = svgRef.current;
    if (!svg || chartData.length === 0 || xStep === 0) return;

    const rect = svg.getBoundingClientRect();
    const scaleX = CHART_WIDTH / rect.width; // because viewBox maps to actual width
    const mouseX = (e.clientX - rect.left) * scaleX;

    let index = Math.round((mouseX - PADDING.left) / xStep);
    index = Math.max(0, Math.min(chartData.length - 1, index));
    setHoverIndex(index);
  };

  const handleChartMouseLeave = () => {
    setHoverIndex(chartData.length > 0 ? Math.floor((chartData.length - 1) / 2) : null);
  };

  // Clamp tooltip position to stay inside viewBox
  const clampTooltip = (x, y, width = 140, height = 56) => {
    const minX = 10;
    const maxX = CHART_WIDTH - width - 10;
    const minY = 10;
    const maxY = CHART_HEIGHT - height - 10;
    return {
      x: Math.min(maxX, Math.max(minX, x - width / 2)),
      y: Math.min(maxY, Math.max(minY, y - height - 6)),
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Layout */}
      <div className="flex h-screen overflow-hidden">
        <Sidebar activePage="dashboard" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
            {/* Search Bar - responsive width */}
            <div className="flex-1 max-w-xs sm:max-w-md">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search..."
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsProfileOpen(false);
                  }}
                  className="relative p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-medium rounded-full flex items-center justify-center">
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
                  className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 px-2 sm:px-3 py-1.5 rounded-lg transition-colors"
                >
                  <div className="text-right hidden xs:block">
                    <p className="text-sm font-medium text-gray-800">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-md flex-shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hidden xs:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${stat.color} flex items-center justify-center text-white text-base sm:text-xl flex-shrink-0`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Revenue Chart - Takes 2/3 of space */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Revenue report</h3>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                        <span>Revenue report</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Period Selector - responsive wrap */}
                  <div className="flex flex-wrap gap-1 mb-6">
                    {['12 months', '6 months', '30 days', '7 days'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setActivePeriod(period)}
                        className={`px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium rounded-lg transition-colors ${activePeriod === period
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>

                  {/* Smooth Line Chart - responsive SVG */}
                  <div className="relative w-full">
                    <svg
                      ref={svgRef}
                      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                      className="w-full h-auto max-h-64"
                      preserveAspectRatio="xMidYMid meet"
                      onMouseMove={handleChartMouseMove}
                      onMouseLeave={handleChartMouseLeave}
                    >
                      {/* Horizontal grid lines + Y-axis labels */}
                      {gridValues.map((gv, idx) => {
                        const y = getY(gv);
                        return (
                          <g key={`grid-${idx}`}>
                            <line
                              x1={PADDING.left}
                              y1={y}
                              x2={CHART_WIDTH - PADDING.right}
                              y2={y}
                              stroke="#e5e7eb"
                              strokeDasharray="4 4"
                              strokeWidth="1"
                            />
                            <text x={PADDING.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
                              £{gv}k
                            </text>
                          </g>
                        );
                      })}

                      {/* Previous period comparison line */}
                      {comparisonPath && (
                        <path d={comparisonPath} fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      )}

                      {/* Current period revenue line */}
                      {mainPath && (
                        <path d={mainPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      )}

                      {/* X-axis labels */}
                      {monthLabels.map((label, i) => (
                        <text
                          key={`${label}-${i}`}
                          x={getX(i)}
                          y={CHART_HEIGHT - 8}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight={hoverIndex === i ? '600' : '400'}
                          fill={hoverIndex === i ? '#2563eb' : '#9ca3af'}
                        >
                          {label}
                        </text>
                      ))}

                      {/* Hover guide line, marker and tooltip */}
                      {hoverIndex !== null && chartData[hoverIndex] !== undefined && (
                        <>
                          <line
                            x1={getX(hoverIndex)}
                            y1={PADDING.top}
                            x2={getX(hoverIndex)}
                            y2={CHART_HEIGHT - PADDING.bottom}
                            stroke="#9ca3af"
                            strokeDasharray="3 3"
                            strokeWidth="1"
                          />
                          <circle
                            cx={getX(hoverIndex)}
                            cy={getY(chartData[hoverIndex])}
                            r="5"
                            fill="#2563eb"
                            stroke="#fff"
                            strokeWidth="2"
                          />

                          {/* Tooltip - position clamped to viewBox */}
                          {(() => {
                            const tooltipWidth = 140;
                            const tooltipHeight = 56;
                            const pos = clampTooltip(
                              getX(hoverIndex),
                              getY(chartData[hoverIndex]),
                              tooltipWidth,
                              tooltipHeight
                            );
                            return (
                              <foreignObject
                                x={pos.x}
                                y={pos.y}
                                width={tooltipWidth}
                                height={tooltipHeight}
                              >
                                <div className="flex flex-col items-center">
                                  <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-1.5 text-center whitespace-nowrap">
                                    <p className="text-[11px] text-gray-500 leading-tight">
                                      {monthLabels[hoverIndex]} {currentYear}
                                    </p>
                                    <p className="text-sm font-bold text-gray-800 leading-tight">
                                      £{(chartData[hoverIndex] * 1000).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 -mt-1"></div>
                                </div>
                              </foreignObject>
                            );
                          })()}
                        </>
                      )}
                    </svg>
                  </div>
                </div>

                {/* Traffic Sources - Takes 1/3 of space */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Traffic Sources</h3>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-bold text-gray-800">1735</span>
                      <span className="text-xs sm:text-sm text-gray-500 ml-1">Clicks</span>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {trafficSources.map((source) => (
                      <div key={source.name}>
                        <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                          <span className="text-gray-700">{source.name}</span>
                          <span className="text-gray-500">
                            {source.value}
                            <span className="ml-1 text-[10px] sm:text-xs text-gray-400">({source.percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
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
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">Recent Orders</h3>
                  <button
                    onClick={handleViewAllOrders}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all
                  </button>
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
                      {(searchQuery ? filteredOrders : recentOrders).map((order) => (
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
                              onClick={() => handleViewOrder(order.id)}
                              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {searchQuery && filteredOrders.length === 0 && (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-sm text-gray-500">No orders found matching "{searchQuery}"</p>
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