import { VisaController } from '@/admin/country/controllers';
import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';
import express from 'express';
const router = express.Router();

router.post('/create-visa', authenticateUser, authorizeRole(['admin']), VisaController.createVisaDetails);

router.get('/get-visa/:visaId', VisaController.getVisaDetails);

router.get('/visa-list', VisaController.getAllVisa);

router.delete('/delete-visa/:visaId', authenticateUser, authorizeRole(['admin']), VisaController.deleteVisa);

router.put('/update-visa/:visaId', authenticateUser, authorizeRole(['admin']), VisaController.updateVisaDetails);

router.get('/trending-visa-list', VisaController.getTrendingVisa);

router.patch('/toggle-trending', VisaController.toggleTrendingStatus);

router.patch('/update-trending-order', VisaController.updateTrendingOrder);

export default router;
