import { Router } from "express";
import { ChildUserController } from "../controller";
import { authenticateUser, authorizeRole } from "@/middleware/authenticatUser";

const router = Router();

router.post(
    '/add-child',
    authenticateUser,
    authorizeRole(["user"]),
    ChildUserController.addChildUser
)

router.get(
    '/get-child-users',
    authenticateUser,
    authorizeRole(["user","admin"]),
    ChildUserController.getChildUsers
)

router.delete(
    '/delete-child-user',
    authenticateUser,
    authorizeRole(["user"]),
    ChildUserController.deleteChildUser
)

router.get(
    '/get-single-child-user',
    authenticateUser,
    authorizeRole(["user","admin"]),
    ChildUserController.getSingleChildUser
)

router.get(
    '/get-all-child-users',
    authenticateUser,
    authorizeRole(["user","admin"]),
    ChildUserController.getAllChildUsers
)
export default router;
