import AuditLog from '../models/AuditLog.js';

export default getAuditLogs = async (req, res, next) => {
    try {
        const { search, module, page = 1, limit = 10, startDate, endDate } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { 'user.name': { $regex: search, $options: 'i' } },
                { 'user.email': { $regex: search, $options: 'i' } },
                { action: { $regex: search, $options: 'i' } },
            ];
        }

        if (module && module !== 'All') {
            query.module = module;
        }

        if (startDate && endDate) {
            query.timestamp = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const logs = await AuditLog.find(query)
            .sort({ timestamp: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await AuditLog.countDocuments(query);

        res.status(200).json({
            success: true,
            data: logs,
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

export default getAuditLog = async (req, res, next) => {
    try {
        const log = await AuditLog.findById(req.params.id);
        if (!log) {
            return res.status(404).json({
                success: false,
                message: 'Audit log not found',
            });
        }
        res.status(200).json({
            success: true,
            data: log,
        });
    } catch (error) {
        next(error);
    }
};

export default getAuditStats = async (req, res, next) => {
    try {
        const stats = await AuditLog.aggregate([
            {
                $group: {
                    _id: '$module',
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalLogs = await AuditLog.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalLogs,
                moduleStats: stats,
            },
        });
    } catch (error) {
        next(error);
    }
};