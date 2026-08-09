import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        customer: {
            name: { type: String, required: true },
            email: { type: String },
            phone: { type: String },
        },
        orderId: {
            type: String,
            ref: 'Order',
        },
        messages: [{
            sender: {
                type: String,
                enum: ['customer', 'support'],
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            time: {
                type: Date,
                default: Date.now,
            },
            read: {
                type: Boolean,
                default: false,
            },
        }],
        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'urgent'],
            default: 'open',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        isUrgent: {
            type: Boolean,
            default: false,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
        unreadCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

chatSchema.pre('save', function() {
    if (this.isModified('messages')) {
        this.lastMessageAt = new Date();
    }
});

export default mongoose.model('Chat', chatSchema);