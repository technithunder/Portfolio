import { AuthController } from '@/auth/controllers';
import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';
import express from 'express';
const router = express.Router();

router.get(
    '/',
    AuthController.HealthRoute
)
router.post(
    '/login-user',
    AuthController.loginUser
)
router.post(
    '/verify-otp',
    AuthController.verifyOtp
)
router.patch(
    '/update-user',
    authenticateUser,
    authorizeRole(["user"]),
    AuthController.updateUser
)
router.post(
    '/resend-otp',
    AuthController.resendOtp
)

export default router;
