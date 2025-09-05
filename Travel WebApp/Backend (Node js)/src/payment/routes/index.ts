import express from 'express';
import { PaymentController } from '../controllers';
import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';

const router = express.Router();

router.post('/create', authenticateUser, authorizeRole(['user']), PaymentController.createPayment);

router.patch('/update', authenticateUser, authorizeRole(['user']), PaymentController.updatePayment);

export default router;
