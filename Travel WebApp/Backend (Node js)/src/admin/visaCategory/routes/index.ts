import { authenticateUser, authorizeRole } from '@/middleware/authenticatUser';
import express from 'express';
import { VisaCategoryController } from '../controllers';
const router = express.Router();

router.post(
  '/create-category',
  authenticateUser,
  authorizeRole(["admin"]),
  VisaCategoryController.createCategory

)
router.get(
  '/get-all-category',
  authenticateUser,
  authorizeRole(["admin", "user"]),
  VisaCategoryController.getCategories
)
router.get(
  '/get-category',
  authenticateUser,
  authorizeRole(["admin"]),
  VisaCategoryController.getCategoryById
)
router.put(
  '/update-category',
  authenticateUser,
  authorizeRole(["admin"]),
  VisaCategoryController.updateCategory
)
router.delete(
  '/delete-category',
  authenticateUser,
  authorizeRole(["admin"]),
  VisaCategoryController.deleteCategory
)
export default router