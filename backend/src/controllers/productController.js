import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';

export const getProducts = async (req, res, next) => {
    try {
        const { category, status, search, page = 1, limit = 10 } = req.query;
        const query = { isActive: true };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (status && status !== 'All') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Product.countDocuments(query);

        // Get product statistics
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalProducts: { $sum: 1 },
                    totalStock: { $sum: '$stock' },
                    totalRevenue: { $sum: '$revenue' },
                    topSelling: { $sum: '$soldThisMonth' },
                    lowStock: {
                        $sum: { $cond: [{ $eq: ['$status', 'Low Stock'] }, 1, 0] },
                    },
                    outOfStock: {
                        $sum: { $cond: [{ $eq: ['$status', 'Out of Stock'] }, 1, 0] },
                    },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: products,
            stats: stats[0] || {
                totalProducts: 0,
                totalStock: 0,
                totalRevenue: 0,
                topSelling: 0,
                lowStock: 0,
                outOfStock: 0,
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

export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Product created',
            module: 'Orders + Inventory',
            details: { productId: product._id, name: product.name, sku: product.sku },
        });

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Product updated',
            module: 'Orders + Inventory',
            details: { productId: product._id, name: product.name, updates: req.body },
        });

        res.status(200).json({
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        next(error);
    }
};

export const updateStock = async (req, res, next) => {
    try {
        const { stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        product.stock = stock;
        await product.save();

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Product stock updated',
            module: 'Orders + Inventory',
            details: { productId: product._id, name: product.name, newStock: stock },
        });

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        product.isActive = false;
        await product.save();

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Product deleted',
            module: 'Orders + Inventory',
            details: { productId: product._id, name: product.name, sku: product.sku },
        });

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getProductStats = async (req, res, next) => {
    try {
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalStock: { $sum: '$stock' },
                    totalRevenue: { $sum: '$revenue' },
                },
            },
        ]);

        const totalProducts = await Product.countDocuments({ isActive: true });
        const topSelling = await Product.find({ isActive: true })
            .sort({ soldThisMonth: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalProducts,
                categoryStats: stats,
                topSelling,
            },
        });
    } catch (error) {
        next(error);
    }
};