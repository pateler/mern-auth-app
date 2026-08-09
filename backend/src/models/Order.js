import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            required: true,
        },
        customer: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String },
            address: {
                street: String,
                city: String,
                state: String,
                zipCode: String,
                country: String,
            },
        },
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            name: String,
            sku: String,
            quantity: Number,
            price: Number,
            total: Number,
        }],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Completed', 'Cancelled', 'Refunded'],
            default: 'Pending',
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Completed', 'Refunded', 'COD'],
            default: 'Pending',
        },
        paymentMethod: {
            type: String,
            enum: ['Card', 'COD', 'Bank Transfer', 'UPI'],
        },
        shippingDetails: {
            carrier: String,
            trackingNumber: String,
            estimatedDelivery: Date,
            actualDelivery: Date,
        },
        notes: String,
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// FIXED: Generate order ID before saving without using next()
orderSchema.pre('save', function () {
    if (!this.orderId) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderId = `ORD-${year}${month}${day}-${random}`;
    }
});

export default mongoose.model('Order', orderSchema);