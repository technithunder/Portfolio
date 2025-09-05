import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';
import { Router } from 'express';
import { StaffController } from '../controller';

const router = Router();

// Staff management routes (Admin only)
router.post('/create', authenticateUser, authorizeRole(['admin']), StaffController.createStaff);
router.get('/get-all', authenticateUser, authorizeRole(['admin']), StaffController.getAllStaff);
router.get('/get', authenticateUser, authorizeRole(['admin', 'staff']), StaffController.getStaffById);
router.put('/update', authenticateUser, authorizeRole(['admin']), StaffController.updateStaff);
router.delete('/delete', authenticateUser, authorizeRole(['admin']), StaffController.deleteStaff);

export default router;