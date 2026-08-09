import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Analytics = () => {
    const [activePeriod, setActivePeriod] = useState('12 months');
    const [activeChart, setActiveChart] = useState('revenue');

    // Mock data for analytics metrics
    const metrics = [
        {
            label: 'Revenue',
            value: '₹4,32,500',
            change: '+16%',
            changeLabel: 'This month',
            changeType: 'positive',
            icon: '💰',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: 'Total Orders',
            value: '1,245',
            change: '+12%',
            changeLabel: 'This month',
            changeType: 'positive',
            icon: '📦',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Avg. Order Value',
            value: '₹3,478',
            change: '+3.2%',
            changeLabel: 'This month',
            changeType: 'positive',
            icon: '📊',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            label: 'Customer Acq. Cost',
            value: '₹847',
            change: '-12%',
            changeLabel: 'This month',
            changeType: 'negative',
            icon: '👤',
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        },
    ];

    // Chart data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = [80, 120, 100, 140, 110, 130, 150, 120, 160, 140, 130, 150];
    const orderData = [120, 140, 110, 150, 130, 160, 140, 170, 150, 180, 160, 200];
    const maxRevenue = Math.max(...revenueData);
    const maxOrders = Math.max(...orderData);

    // Traffic sources data
    const trafficSources = [
        { name: 'Direct', value: 1341, percentage: 76.1, color: 'bg-blue-500' },
        { name: 'Meta Ads', value: 217, percentage: 13.4, color: 'bg-green-500' },
        { name: 'Google Maps', value: 124, percentage: 6.2, color: 'bg-orange-500' },
        { name: 'Organic Search', value: 53, percentage: 3.4, color: 'bg-purple-500' },
    ];

    // Current month data
    const currentMonth = 'Jun 2025';
    const currentRevenue = '₹88,400';

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar activePage="analytics" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Analytics</h1>
                        <p className="text-sm text-gray-500">Track your business performance metrics</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Date Range */}
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                1 March 2026
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>

                        {/* Export Button */}
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export Report
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {metrics.map((metric) => (
                                <div key={metric.label} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500 font-medium">{metric.label}</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</p>
                                            <div className="flex items-center gap-1 mt-1.5">
                                                <span className={`text-sm font-medium ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {metric.change}
                                                </span>
                                                <span className="text-xs text-gray-400">{metric.changeLabel}</span>
                                            </div>
                                        </div>
                                        <div className={`w-11 h-11 rounded-xl ${metric.bgColor} flex items-center justify-center ${metric.color} text-xl flex-shrink-0`}>
                                            {metric.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Revenue Chart */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Revenue report</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setActiveChart('revenue')}
                                            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${activeChart === 'revenue'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            Revenue
                                        </button>
                                        <button
                                            onClick={() => setActiveChart('orders')}
                                            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${activeChart === 'orders'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            Orders
                                        </button>
                                    </div>
                                </div>

                                {/* Period Selector */}
                                <div className="flex gap-1 mb-4">
                                    {['12 months', '6 months', '30 days', '7 days'].map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => setActivePeriod(period)}
                                            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${activePeriod === period
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>

                                {/* Bar Chart */}
                                <div className="relative">
                                    <div className="h-48 flex items-end gap-1.5 pb-6">
                                        {(activeChart === 'revenue' ? revenueData : orderData).map((value, index) => (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                                <div
                                                    className={`w-full ${activeChart === 'revenue' ? 'bg-blue-500' : 'bg-green-500'} rounded-t hover:opacity-80 transition-all duration-200`}
                                                    style={{
                                                        height: `${((value) / (activeChart === 'revenue' ? maxRevenue : maxOrders)) * 100}%`,
                                                        minHeight: '4px'
                                                    }}
                                                ></div>
                                                <span className="text-xs text-gray-500">{months[index]}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Y-axis labels */}
                                    <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-400">
                                        <span>200k</span>
                                        <span>150k</span>
                                        <span>100k</span>
                                        <span>50k</span>
                                        <span>0</span>
                                    </div>
                                    {/* Current value indicator */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                                        <span className="text-sm font-semibold text-gray-800">{currentMonth}</span>
                                        <span className="text-sm font-bold text-blue-600 ml-2">{currentRevenue}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Report & Traffic Sources */}
                            <div className="space-y-4">
                                {/* Order Report */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Order report</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Jun 2025</span>
                                            <span className="text-sm font-bold text-gray-800">128</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="h-32 flex items-end gap-1.5">
                                            {orderData.slice(0, 12).map((value, index) => (
                                                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                                                    <div
                                                        className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-all duration-200"
                                                        style={{
                                                            height: `${(value / maxOrders) * 100}%`,
                                                            minHeight: '4px'
                                                        }}
                                                    ></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
                                            <span>200</span>
                                            <span>150</span>
                                            <span>100</span>
                                            <span>50</span>
                                            <span>0</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Traffic Sources */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Traffic Sources</h3>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-gray-800">1735</span>
                                            <span className="text-sm text-gray-500 ml-1">Clicks</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;