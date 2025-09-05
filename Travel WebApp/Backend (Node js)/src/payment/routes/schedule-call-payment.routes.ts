import express from 'express';
import { ScheduleCallPaymentController } from '../controllers/schedule-call-payment.controller';
import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';

const router = express.Router();

router.post('/create', authenticateUser, authorizeRole(['user']), ScheduleCallPaymentController.createPayment);

router.patch('/update', authenticateUser, authorizeRole(['user']), ScheduleCallPaymentController.updatePayment);

export default router;
