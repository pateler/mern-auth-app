import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Generate random ID
export const generateId = (prefix = '') => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}${random}`.toUpperCase();
};

// Format currency
export const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

// Get date range
export const getDateRange = (period) => {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
        case '7 days':
            startDate.setDate(now.getDate() - 7);
            break;
        case '30 days':
            startDate.setDate(now.getDate() - 30);
            break;
        case '6 months':
            startDate.setMonth(now.getMonth() - 6);
            break;
        case '12 months':
        default:
            startDate.setMonth(now.getMonth() - 12);
    }

    return { startDate, endDate: now };
};