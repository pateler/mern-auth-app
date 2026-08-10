import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';

// ---------------------------------------------------------------------------
// Shared geometry helpers (same smooth-curve approach used on the Dashboard)
// ---------------------------------------------------------------------------

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

const PERIODS = ['12 months', '6 months', '30 days', '7 days'];
const ALL_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Factory that produces a `getSeries(period)` function from a 12-month dataset
function makeSeriesGenerator({ allData, allComparison, sevenDay, thirtyDay }) {
    return (period) => {
        const currentMonthIndex = new Date().getMonth();
        let months, data, comparison;

        switch (period) {
            case '7 days':
                months = sevenDay.months;
                data = sevenDay.data;
                comparison = sevenDay.comparison;
                break;
            case '30 days':
                months = thirtyDay.months;
                data = thirtyDay.data;
                comparison = thirtyDay.comparison;
                break;
            case '6 months':
                months = ALL_MONTHS.slice(currentMonthIndex - 5, currentMonthIndex + 1);
                data = allData.slice(currentMonthIndex - 5, currentMonthIndex + 1);
                comparison = allComparison.slice(currentMonthIndex - 5, currentMonthIndex + 1);
                break;
            case '12 months':
            default:
                months = ALL_MONTHS;
                data = allData;
                comparison = allComparison;
                break;
        }

        const rawMax = Math.max(...data, ...comparison);
        const niceMax = Math.ceil(rawMax / 50) * 50 || 50;
        return { months, data, comparison, niceMax };
    };
}

const revenueSeriesGenerator = makeSeriesGenerator({
    allData: [80, 120, 100, 140, 110, 130, 150, 120, 160, 140, 130, 150],
    allComparison: [50, 65, 60, 90, 85, 95, 100, 90, 95, 105, 110, 115],
    sevenDay: {
        months: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [45, 67, 89, 120, 95, 110, 88],
        comparison: [30, 40, 55, 80, 70, 85, 75],
    },
    thirtyDay: {
        months: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [320, 450, 380, 520],
        comparison: [200, 280, 260, 340],
    },
});

const orderSeriesGenerator = makeSeriesGenerator({
    allData: [120, 140, 110, 150, 130, 160, 140, 170, 150, 180, 160, 200],
    allComparison: [90, 100, 85, 110, 100, 120, 105, 130, 115, 140, 120, 150],
    sevenDay: {
        months: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [12, 18, 22, 30, 25, 28, 20],
        comparison: [8, 12, 16, 22, 18, 20, 15],
    },
    thirtyDay: {
        months: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        data: [280, 340, 310, 380],
        comparison: [200, 240, 220, 270],
    },
});

// ---------------------------------------------------------------------------
// TrendChart — the smooth two-line chart w/ hover tooltip
// ---------------------------------------------------------------------------

const TrendChart = ({
    title,
    getSeries,
    chartWidth = 900,
    chartHeight = 260,
    valuePrefix = '',
    tooltipMultiplier = 1,
    size = 'lg',
}) => {
    const svgRef = useRef(null);
    const [activePeriod, setActivePeriod] = useState(PERIODS[0]);
    const [monthLabels, setMonthLabels] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [comparisonData, setComparisonData] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const [hoverIndex, setHoverIndex] = useState(null);

    const PADDING =
        size === 'lg'
            ? { left: 56, right: 16, top: 20, bottom: 28 }
            : { left: 40, right: 8, top: 16, bottom: 24 };

    useEffect(() => {
        const { months, data, comparison, niceMax } = getSeries(activePeriod);
        setMonthLabels(months);
        setChartData(data);
        setComparisonData(comparison);
        setMaxValue(niceMax);
        setHoverIndex(data.length > 0 ? Math.floor((data.length - 1) / 2) : null);
    }, [activePeriod, getSeries]);

    const plotWidth = chartWidth - PADDING.left - PADDING.right;
    const plotHeight = chartHeight - PADDING.top - PADDING.bottom;
    const xStep = chartData.length > 1 ? plotWidth / (chartData.length - 1) : 0;

    const getX = (i) => PADDING.left + i * xStep;
    const getY = (v) => PADDING.top + (1 - (maxValue > 0 ? v / maxValue : 0)) * plotHeight;

    const gridValues = [1, 0.75, 0.5, 0.25, 0].map((f) => Math.round(maxValue * f));

    const mainPath = buildSmoothPath(chartData.map((v, i) => ({ x: getX(i), y: getY(v) })));
    const comparisonPath = buildSmoothPath(comparisonData.map((v, i) => ({ x: getX(i), y: getY(v) })));

    const currentYear = new Date().getFullYear();

    const handleMouseMove = (e) => {
        const svg = svgRef.current;
        if (!svg || chartData.length === 0 || xStep === 0) return;

        const rect = svg.getBoundingClientRect();
        const scaleX = chartWidth / rect.width;
        const mouseX = (e.clientX - rect.left) * scaleX;

        let index = Math.round((mouseX - PADDING.left) / xStep);
        index = Math.max(0, Math.min(chartData.length - 1, index));
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(chartData.length > 0 ? Math.floor((chartData.length - 1) / 2) : null);
    };

    const formatTooltipValue = (v) => `${valuePrefix}${(v * tooltipMultiplier).toLocaleString('en-IN')}`;
    const formatGridValue = (v) => `${valuePrefix}${v}${tooltipMultiplier > 1 ? 'k' : ''}`;

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1 gap-2">
                <button className="flex items-center gap-1 text-base sm:text-lg font-semibold text-gray-800">
                    {title}
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div className="flex flex-wrap gap-1">
                    {PERIODS.map((period) => (
                        <button
                            key={period}
                            onClick={() => setActivePeriod(period)}
                            className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full transition-colors ${activePeriod === period
                                    ? 'border border-gray-300 text-gray-800 bg-white'
                                    : 'border border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative mt-3 sm:mt-5">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className={`w-full ${size === 'lg' ? 'h-48 sm:h-64' : 'h-32 sm:h-40'} select-none`}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Horizontal grid lines + Y-axis labels */}
                    {gridValues.map((gv, idx) => {
                        const y = getY(gv);
                        return (
                            <g key={`grid-${idx}`}>
                                <line
                                    x1={PADDING.left}
                                    y1={y}
                                    x2={chartWidth - PADDING.right}
                                    y2={y}
                                    stroke="#e5e7eb"
                                    strokeDasharray="4 4"
                                    strokeWidth="1"
                                />
                                <text x={PADDING.left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
                                    {formatGridValue(gv)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Previous period comparison line */}
                    {comparisonPath && (
                        <path d={comparisonPath} fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    )}

                    {/* Current period line */}
                    {mainPath && (
                        <path d={mainPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    )}

                    {/* X-axis labels */}
                    {monthLabels.map((label, i) => (
                        <text
                            key={`${label}-${i}`}
                            x={getX(i)}
                            y={chartHeight - 8}
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
                                y2={chartHeight - PADDING.bottom}
                                stroke="#9ca3af"
                                strokeDasharray="3 3"
                                strokeWidth="1"
                            />
                            <circle cx={getX(hoverIndex)} cy={getY(chartData[hoverIndex])} r="5" fill="#2563eb" stroke="#fff" strokeWidth="2" />

                            <foreignObject
                                x={Math.max(2, Math.min(chartWidth - 142, getX(hoverIndex) - 70))}
                                y={Math.max(2, getY(chartData[hoverIndex]) - 62)}
                                width="140"
                                height="56"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-1.5 text-center whitespace-nowrap">
                                        <p className="text-[11px] text-gray-500 leading-tight">
                                            {monthLabels[hoverIndex]} {currentYear}
                                        </p>
                                        <p className="text-sm font-bold text-gray-800 leading-tight">
                                            {formatTooltipValue(chartData[hoverIndex])}
                                        </p>
                                    </div>
                                    <div className="w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 -mt-1"></div>
                                </div>
                            </foreignObject>
                        </>
                    )}
                </svg>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Sparkline — tiny trend line used on each metric card
// ---------------------------------------------------------------------------

const Sparkline = ({ data, color = '#22c55e', width = 104, height = 32 }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = data.length > 1 ? width / (data.length - 1) : 0;
    const points = data.map((v, i) => ({ x: i * step, y: height - ((v - min) / range) * (height - 4) - 2 }));
    const path = buildSmoothPath(points);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-16 sm:w-24 h-6 sm:h-8" preserveAspectRatio="none">
            <path d={path} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

// ---------------------------------------------------------------------------
// GaugeChart — semi-circle "Clicks" gauge for the Traffic Sources card
// ---------------------------------------------------------------------------

const GaugeChart = ({ sources, total }) => {
    const width = 240;
    const height = 132;
    const cx = width / 2;
    const cy = height - 8;
    const r = 92;
    const circumference = Math.PI * r; // semicircle arc length

    let cumulative = 0;
    const segments = sources.map((s) => {
        const segLen = (s.percentage / 100) * circumference;
        const seg = { ...s, dasharray: `${segLen} ${circumference - segLen}`, dashoffset: -cumulative };
        cumulative += segLen;
        return seg;
    });

    const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[240px] mx-auto">
            <path d={arcPath} fill="none" stroke="#f3f4f6" strokeWidth="16" />
            {segments.map((seg, i) => (
                <path
                    key={i}
                    d={arcPath}
                    fill="none"
                    stroke={seg.hex}
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={seg.dasharray}
                    strokeDashoffset={seg.dashoffset}
                />
            ))}
            <text x={cx} y={cy - 34} textAnchor="middle" fontSize="26" fontWeight="700" fill="#1f2937">
                {total}
            </text>
            <text x={cx} y={cy - 14} textAnchor="middle" fontSize="12" fill="#6b7280">
                Clicks
            </text>
        </svg>
    );
};

// ---------------------------------------------------------------------------
// Analytics page
// ---------------------------------------------------------------------------

const Analytics = () => {
    const { user } = useAuth(); // Proper import from context
    const [searchQuery, setSearchQuery] = useState('');
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [dateRange] = useState({ start: '1 March 2026', end: '31 March 2026' });

    // Notification state (same as Dashboard)
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New order received', message: 'Order #ORD-1024 has been placed', time: '2 mins ago', read: false },
        { id: 2, title: 'Payment confirmed', message: 'Payment for order #ORD-1023 has been confirmed', time: '15 mins ago', read: false },
        { id: 3, title: 'Low stock alert', message: 'Product "iPhone 15 Case" is running low on stock', time: '1 hour ago', read: true },
        { id: 4, title: 'New customer message', message: 'Sufyan Shaikh sent a message about order #ORD-1024', time: '2 hours ago', read: true },
    ]);
    const [unreadCount, setUnreadCount] = useState(notifications.filter(n => !n.read).length);

    // Mock data for analytics metric cards (value + small trend sparkline)
    const metrics = [
        {
            label: 'Revenue',
            value: '₹4,32,500',
            change: '+16%',
            changeLabel: 'This month',
            changeType: 'positive',
            trend: [30, 42, 35, 55, 48, 60, 52, 70, 58, 75, 66, 84],
        },
        {
            label: 'Total Orders',
            value: '1,245',
            change: '+12%',
            changeLabel: 'This month',
            changeType: 'positive',
            trend: [40, 46, 42, 52, 48, 58, 50, 60, 55, 64, 60, 70],
        },
        {
            label: 'Avg. Order Value',
            value: '₹347',
            change: '+3.2%',
            changeLabel: 'This month',
            changeType: 'positive',
            trend: [50, 52, 51, 54, 53, 55, 54, 56, 55, 57, 56, 58],
        },
        {
            label: 'Customer Acq. Cost',
            value: '₹42',
            change: '-12%',
            changeLabel: 'This month',
            changeType: 'negative',
            trend: [70, 65, 68, 60, 62, 55, 58, 50, 52, 46, 48, 40],
        },
    ];

    // Traffic sources data (gauge + legend)
    const trafficSources = [
        { name: 'Direct', value: 1341, percentage: 76.1, hex: '#3b82f6', dotClass: 'bg-blue-500' },
        { name: 'Meta Ads', value: 217, percentage: 13.4, hex: '#a78bfa', dotClass: 'bg-violet-400' },
        { name: 'Google Maps', value: 124, percentage: 6.2, hex: '#2dd4bf', dotClass: 'bg-teal-400' },
        { name: 'Organic Search', value: 53, percentage: 3.4, hex: '#fb923c', dotClass: 'bg-orange-400' },
    ];

    // Handler for notifications (same as Dashboard)
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

    // Click outside handlers (same as Dashboard)
    useEffect(() => {
        const handleClickOutside = () => {
            setIsNotificationOpen(false);
            setIsProfileOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar activePage="analytics" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center gap-3 sm:gap-6 flex-shrink-0">
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-800 whitespace-nowrap">Analytics</h1>

                    <div className="flex-1 min-w-[120px] max-w-xs sm:max-w-md">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Right side: notifications + profile */}
                    <div className="flex items-center gap-2 sm:gap-4 ml-auto">
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
                        {/* Date range */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                            <button className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm text-gray-600 bg-white whitespace-nowrap">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {dateRange.start}
                                <span className="text-gray-300">–</span>
                                {dateRange.end}
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {metrics.map((metric) => (
                                <div key={metric.label} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{metric.value}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{metric.label}</p>
                                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                                        <Sparkline data={metric.trend} color={metric.changeType === 'positive' ? '#22c55e' : '#ef4444'} />
                                        <div className="text-right">
                                            <span className={`text-xs sm:text-sm font-medium block ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                                {metric.change}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-gray-400">{metric.changeLabel}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Revenue report — full width */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
                            <TrendChart
                                title="Revenue report"
                                getSeries={revenueSeriesGenerator}
                                chartWidth={1040}
                                chartHeight={280}
                                valuePrefix="₹"
                                tooltipMultiplier={1000}
                                size="lg"
                            />
                        </div>

                        {/* Order report & Traffic Sources */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Order report */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
                                <TrendChart
                                    title="Order report"
                                    getSeries={orderSeriesGenerator}
                                    chartWidth={520}
                                    chartHeight={220}
                                    valuePrefix=""
                                    tooltipMultiplier={1}
                                    size="sm"
                                />
                            </div>

                            {/* Traffic Sources */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Traffic Sources</h3>
                                </div>

                                <GaugeChart sources={trafficSources} total={1735} />

                                <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                                    {trafficSources.map((source) => (
                                        <div key={source.name} className="flex items-center justify-between text-xs sm:text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${source.dotClass}`}></span>
                                                <span className="text-gray-700">{source.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <span className="text-gray-800 font-medium">{source.value}</span>
                                                <span className="text-gray-400 text-[10px] sm:text-xs w-12 text-right">({source.percentage}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;