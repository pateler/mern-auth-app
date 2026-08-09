import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/auth.js';
import {
    getAuditLogs,
    getAuditLog,
    getAuditStats,
} from '../controllers/auditController.js';

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/', getAuditLogs);
router.get('/stats', getAuditStats);
router.get('/:id', getAuditLog);

export default router;