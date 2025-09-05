import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';
import express from 'express';
import { VisaTypeController } from '../controllers';

const router= express.Router()
router.post(
    '/create-visatype',
    authenticateUser,
    authorizeRole(["admin"]),
    VisaTypeController.createVisaType

)

router.get(
    '/get-all-visatype',
    authenticateUser,
    authorizeRole(["admin", "user"]),
    VisaTypeController.getAllVisaType
)

router.get(
    '/get-visatype',
    authenticateUser,
    authorizeRole(["admin"]),
    VisaTypeController.getVisaType
)

router.delete(
    '/delete-visatype/:id',
    authenticateUser,
    authorizeRole(["admin"]),
    VisaTypeController.deleteVisaType
)

router.put(
    '/update-visatype',
    authenticateUser,
    authorizeRole(["admin"]),
    VisaTypeController.updateVisaType
)
export default router