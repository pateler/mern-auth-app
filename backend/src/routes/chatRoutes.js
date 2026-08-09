import express from 'express';
const router = express.Router();
import { protect } from '../middleware/auth.js';
import {
  getChats,
  getChat,
  createChat,
  addMessage,
  resolveChat,
  markUrgent,
  assignChat,
} from '../controllers/chatController.js';

router.use(protect);

router.get('/', getChats);
router.get('/:id', getChat);
router.post('/', createChat);
router.post('/:id/messages', addMessage);
router.put('/:id/resolve', resolveChat);
router.put('/:id/urgent', markUrgent);
router.put('/:id/assign', assignChat);

export default router;