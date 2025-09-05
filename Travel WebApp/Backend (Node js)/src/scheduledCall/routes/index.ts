import express from 'express';
import { ScheduledCallController } from '../controllers';
import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';

const router = express.Router();

router.post('/book', authenticateUser, authorizeRole(['user']), ScheduledCallController.bookCall);
router.get('/available-slots', ScheduledCallController.getAvailableSlots);
router.get('/user-calls', authenticateUser, authorizeRole(['user']), ScheduledCallController.getUserCalls);
router.put('/:id', authenticateUser, authorizeRole(['user']), ScheduledCallController.updateCall);
router.delete('/:id', authenticateUser, authorizeRole(['user']), ScheduledCallController.deleteCall);

export default router;
