import express from 'express';
import { login, registerUser } from '../controller/index';
import { authenticateUser } from '@/middleware/authenticatUser';
const router = express.Router();

router.post(
    '/login',
    login
)
router.post(
    '/register',
    registerUser
)
export default router;