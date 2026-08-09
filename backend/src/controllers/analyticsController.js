import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import moment from 'moment';

export default getDashboardAnalytics = async (req, res, next) => {
    try {
        const { period = 'month' } = req.query;
        const startDate = moment().subtract(1, period).startOf(period);
        const endDate = moment().endOf('day');

        // Revenue metrics
        const revenueData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
                    status: 'Completed',
                },
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    totalRevenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Order metrics
        const orderMetrics = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
                },
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: '$totalAmount' },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
                    },
                },
            },
        ]);

        // Customer acquisition cost (mock calculation)
        const totalUsers = await User.countDocuments({
            createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        });

        const totalRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
                    status: 'Completed',
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' },
                },
            },
        ]);

        // Monthly revenue data
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: moment().subtract(12, 'months').startOf('month').toDate() },
                    status: 'Completed',
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                metrics: {
                    revenue: totalRevenue[0]?.total || 0,
                    totalOrders: orderMetrics[0]?.totalOrders || 0,
                    avgOrderValue: orderMetrics[0]?.avgOrderValue || 0,
                    customerAcquisitionCost: totalUsers > 0 ? (totalRevenue[0]?.total || 0) / totalUsers : 0,
                    pendingOrders: orderMetrics[0]?.pendingOrders || 0,
                },
                revenueData: monthlyRevenue,
                orderData: monthlyRevenue.map(item => ({
                    ...item,
                    orders: item.orders,
                })),
                totalUsers,
            },
        });
    } catch (error) {
        next(error);
    }
};

export default getRevenueReport = async (req, res, next) => {
    try {
        const { period = '12 months' } = req.query;
        let startDate;

        switch (period) {
            case '7 days':
                startDate = moment().subtract(7, 'days');
                break;
            case '30 days':
                startDate = moment().subtract(30, 'days');
                break;
            case '6 months':
                startDate = moment().subtract(6, 'months');
                break;
            default:
                startDate = moment().subtract(12, 'months');
        }

        const revenueData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate.toDate() },
                    status: 'Completed',
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' },
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        ]);

        res.status(200).json({
            success: true,
            data: revenueData,
        });
    } catch (error) {
        next(error);
    }
};

export default getTrafficSources = async (req, res, next) => {
    try {
        // Mock traffic data (in real app, this would come from analytics tracking)
        const trafficData = [
            { name: 'Direct', value: 1341, percentage: 76.1 },
            { name: 'Meta Ads', value: 217, percentage: 13.4 },
            { name: 'Google Maps', value: 124, percentage: 6.2 },
            { name: 'Organic Search', value: 53, percentage: 3.4 },
        ];

        res.status(200).json({
            success: true,
            data: trafficData,
        });
    } catch (error) {
        next(error);
    }
};