import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/auth.js';
import {
    getSettings,
    updateGeneralSettings,
    updateNotifications,
    getIntegrations,
    updateIntegration,
    syncIntegration,
    getTeamMembers,
    updateTeamMember,
} from '../controllers/settingsController.js';

router.use(protect);

router.get('/', getSettings);
router.put('/general', updateGeneralSettings);
router.put('/notifications', updateNotifications);

// Integration routes
router.get('/integrations', getIntegrations);
router.put('/integrations/:id', authorize('admin', 'super_admin'), updateIntegration);
router.post('/integrations/:id/sync', authorize('admin', 'super_admin'), syncIntegration);

// Team management routes
router.get('/team', authorize('admin', 'super_admin'), getTeamMembers);
router.put('/team/:id', authorize('admin', 'super_admin'), updateTeamMember);

export default router;