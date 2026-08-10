import Chat from '../models/Chat.js';
import AuditLog from '../models/AuditLog.js';

export const getChats = async (req, res, next) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status && status !== 'All') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { 'customer.name': { $regex: search, $options: 'i' } },
                { orderId: { $regex: search, $options: 'i' } },
                { 'customer.phone': { $regex: search, $options: 'i' } },
            ];
        }

        const chats = await Chat.find(query)
            .sort({ lastMessageAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('assignedTo', 'name email');

        const total = await Chat.countDocuments(query);

        res.status(200).json({
            success: true,
            data: chats,
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

export const getChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id).populate('assignedTo', 'name email');
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }
        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        next(error);
    }
};

export const createChat = async (req, res, next) => {
    try {
        const chat = await Chat.create(req.body);

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Chat created',
            module: 'Full',
            details: { chatId: chat._id, customer: chat.customer.name },
        });

        res.status(201).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        next(error);
    }
};

export const addMessage = async (req, res, next) => {
    try {
        const { message, sender } = req.body;
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        chat.messages.push({
            sender,
            message,
            time: new Date(),
        });

        chat.lastMessageAt = new Date();
        if (sender === 'customer') {
            chat.unreadCount += 1;
        }

        await chat.save();

        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        next(error);
    }
};

export const resolveChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        chat.status = 'resolved';
        await chat.save();

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Chat resolved',
            module: 'Full',
            details: { chatId: chat._id, customer: chat.customer.name },
        });

        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        next(error);
    }
};

export const markUrgent = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        chat.isUrgent = true;
        chat.status = 'urgent';
        await chat.save();

        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        next(error);
    }
};

export const assignChat = async (req, res, next) => {
    try {
        const { assignedTo } = req.body;
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: 'Chat not found',
            });
        }

        chat.assignedTo = assignedTo;
        chat.status = 'in_progress';
        await chat.save();

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: 'Chat assigned',
            module: 'Full',
            details: { chatId: chat._id, assignedTo },
        });

        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        next(error);
    }
};