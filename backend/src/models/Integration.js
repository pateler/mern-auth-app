import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            enum: ['WooCommerce', 'Shiprocket', 'Razorpay', 'WhatsApp API', 'Meta Ads'],
        },
        status: {
            type: String,
            enum: ['connected', 'disconnected', 'error'],
            default: 'disconnected',
        },
        apiKey: {
            type: String,
            select: false,
        },
        apiSecret: {
            type: String,
            select: false,
        },
        webhookUrl: String,
        lastSynced: {
            type: Date,
            default: Date.now,
        },
        settings: {
            type: mongoose.Schema.Types.Mixed,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Integration', integrationSchema);