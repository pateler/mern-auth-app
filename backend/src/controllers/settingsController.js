import User from '../models/User.js';
import Integration from '../models/Integration.js';
import AuditLog from '../models/AuditLog.js';

export default getSettings = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('preferences companyDetails workspace');
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export default updateGeneralSettings = async (req, res, next) => {
    try {
        const { companyName, contactNumber, businessAddress, timezone, currency } = req.body;
        const user = await User.findById(req.user.id);

        if (companyName) user.companyDetails.companyName = companyName;
        if (contactNumber) user.companyDetails.contactNumber = contactNumber;
        if (businessAddress) user.companyDetails.businessAddress = businessAddress;
        if (timezone) user.preferences.timezone = timezone;
        if (currency) user.preferences.currency = currency;

        await user.save();

        // Log audit
        await AuditLog.create({
            user: { name: user.name, email: user.email, userId: user._id },
            action: 'General settings updated',
            module: 'Settings',
        });

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export default updateNotifications = async (req, res, next) => {
    try {
        const notifications = req.body;
        const user = await User.findById(req.user.id);

        user.preferences.notifications = {
            ...user.preferences.notifications,
            ...notifications,
        };

        await user.save();

        // Log audit
        await AuditLog.create({
            user: { name: user.name, email: user.email, userId: user._id },
            action: 'Notification settings updated',
            module: 'Settings',
        });

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export default getIntegrations = async (req, res, next) => {
    try {
        const integrations = await Integration.find({ isActive: true });
        res.status(200).json({
            success: true,
            data: integrations,
        });
    } catch (error) {
        next(error);
    }
};

export default updateIntegration = async (req, res, next) => {
    try {
        const { status, settings } = req.body;
        const integration = await Integration.findById(req.params.id);
        if (!integration) {
            return res.status(404).json({
                success: false,
                message: 'Integration not found',
            });
        }

        if (status) integration.status = status;
        if (settings) integration.settings = { ...integration.settings, ...settings };
        integration.lastSynced = new Date();

        await integration.save();

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: `Integration ${integration.name} updated`,
            module: 'Settings',
            details: { integration: integration.name, status: integration.status },
        });

        res.status(200).json({
            success: true,
            data: integration,
        });
    } catch (error) {
        next(error);
    }
};

export default syncIntegration = async (req, res, next) => {
    try {
        const integration = await Integration.findById(req.params.id);
        if (!integration) {
            return res.status(404).json({
                success: false,
                message: 'Integration not found',
            });
        }

        integration.lastSynced = new Date();
        await integration.save();

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: `Integration ${integration.name} synced`,
            module: 'Settings',
            details: { integration: integration.name },
        });

        res.status(200).json({
            success: true,
            message: `Integration ${integration.name} synced successfully`,
            data: integration,
        });
    } catch (error) {
        next(error);
    }
};

export default getTeamMembers = async (req, res, next) => {
    try {
        const users = await User.find({ isActive: true }).select('name email role lastLogin');
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

export default updateTeamMember = async (req, res, next) => {
    try {
        const { role, isActive } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        // Log audit
        await AuditLog.create({
            user: { name: req.user.name, email: req.user.email, userId: req.user._id },
            action: `Team member ${user.name} updated`,
            module: 'Team Management',
            details: { userId: user._id, role: user.role, isActive: user.isActive },
        });

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};