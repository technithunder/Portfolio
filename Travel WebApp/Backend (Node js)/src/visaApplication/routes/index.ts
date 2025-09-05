import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';
import express from 'express';
import { VisaApplicationController } from '../controller';
const router = express.Router();

router.post('/create-visa-application', authenticateUser, authorizeRole(['user']), VisaApplicationController.createVisaApplication);
router.get('/get-all-visa-application', authenticateUser, authorizeRole(['user', 'admin', 'staff']), VisaApplicationController.getAllVisaApplication);

router.get('/get-visa-application/:appId', authenticateUser, authorizeRole(['user', 'admin', 'staff']), VisaApplicationController.getVisaApplication);

router.put('/update-visa-application-status', authenticateUser, authorizeRole(['admin', 'staff']), VisaApplicationController.updateVisaApplicationStatus);

router.delete('/delete-visa-application', authenticateUser, authorizeRole(['user']), VisaApplicationController.deleteVisaApplication);
router.put('/apply-visa', authenticateUser, authorizeRole(['user']), VisaApplicationController.applyforVisa);
router.put('/assign-visa-application', authenticateUser, authorizeRole(['admin']), VisaApplicationController.assignVisaApplication);
export default router;
