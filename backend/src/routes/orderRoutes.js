import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/auth.js';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
} from '../controllers/orderController.js';
import { validateOrder, handleValidationErrors } from '../middleware/validation.js';

router.use(protect);

router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrder);
router.post('/', validateOrder, handleValidationErrors, createOrder);
router.put('/:id', updateOrder);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', authorize('admin', 'super_admin'), deleteOrder);

export default router;