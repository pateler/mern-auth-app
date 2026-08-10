import Order from '../models/Order.js';
import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';

export const getOrders = async (req, res, next) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { orderId: { $regex: search, $options: 'i' } },
                { 'customer.name': { $regex: search, $options: 'i' } },
                { 'customer.phone': { $regex: search, $options: 'i' } },
            ];
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('processedBy', 'name email');

        const total = await Order.countDocuments(query);

        // Get order statistics
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
                    },
                    processingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'Processing'] }, 1, 0] },
                    },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] },
                    },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: orders,
            stats: stats[0] || {
                totalOrders: 0,
                totalRevenue: 0,
                pendingOrders: 0,
                processingOrders: 0,
                completedOrders: 0,
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('processedBy', 'name email');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const createOrder = async (req, res, next) => {
    try {
        const orderData = req.body;
        orderData.processedBy = req.user.id;

        const order = await Order.create(orderData);

        // Update product stock
        for (const item of order.items) {
            if (item.productId) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity, soldThisMonth: item.quantity },
                });
            }
        }

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Order created',
            module: 'Orders + Inventory',
            details: { orderId: order.orderId },
        });

        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Order updated',
            module: 'Orders + Inventory',
            details: { orderId: order.orderId, updates: req.body },
        });

        res.status(200).json({
            success: true,
            data: updatedOrder,
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.status = status;
        await order.save();

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Order status updated',
            module: 'Orders + Inventory',
            details: { orderId: order.orderId, newStatus: status },
        });

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        await order.remove();

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Order deleted',
            module: 'Orders + Inventory',
            details: { orderId: order.orderId },
        });

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderStats = async (req, res, next) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' },
                },
            },
        ]);

        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                stats,
            },
        });
    } catch (error) {
        next(error);
    }
};