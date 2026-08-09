import express from 'express';
const router = express.Router();
import { protect, authorize } from '../middleware/auth.js';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  getProductStats,
} from '../controllers/productController.js';
import { validateProduct, handleValidationErrors } from '../middleware/validation.js';

router.use(protect);

router.get('/', getProducts);
router.get('/stats', getProductStats);
router.get('/:id', getProduct);
router.post('/', authorize('admin', 'super_admin'), validateProduct, handleValidationErrors, createProduct);
router.put('/:id', authorize('admin', 'super_admin'), updateProduct);
router.patch('/:id/stock', authorize('admin', 'super_admin'), updateStock);
router.delete('/:id', authorize('admin', 'super_admin'), deleteProduct);

export default router;