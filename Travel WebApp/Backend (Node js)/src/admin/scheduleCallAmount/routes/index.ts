import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';
import express from 'express';
import { ScheduleCallAmountController } from '../controller';

const router = express.Router();

router.post(
    '/create',
    authenticateUser,
    authorizeRole(["admin"]),
    ScheduleCallAmountController.createScheduleCallAmount
)
router.get(
    '/get',
    authenticateUser,
    authorizeRole(["admin", "user"]),
    ScheduleCallAmountController.getAllScheduleCallAmount
)
export default router
