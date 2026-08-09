import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        },
        action: {
            type: String,
            required: true,
        },
        module: {
            type: String,
            required: true,
            enum: ['Full', 'Orders + Inventory', 'Orders', 'Inventory', 'Settings', 'Users'],
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
        },
        device: {
            type: String,
        },
        ipAddress: {
            type: String,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('AuditLog', auditLogSchema);