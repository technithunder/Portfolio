import express from "express";
import {
  createStaff,
  deleteStaff,
  fetchNationalities,
  fetchStatus,
  getAllStaff,
  getStaffById,
  updateStaff,
} from "../controllers/staffControlller";
import { checkAdminLogin } from "@/middlewares/authMiddleware";
import { upload } from "@/middlewares/upload";

const router = express.Router();
// /**
//  * @swagger
//  * /api/staff:
//  *   post:
//  *     summary: Create a new staff member
//  *     tags: [Staff]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               role:
//  *                 type: string
//  *               position:
//  *                 type: string
//  *               joiningDate:
//  *                 type: string
//  *                 format: date
//  *               firstName:
//  *                 type: string
//  *               lastName:
//  *                 type: string
//  *               age:
//  *                 type: integer
//  *               gender:
//  *                 type: string
//  *                 enum: [male, female]
//  *               dob:
//  *                 type: string
//  *                 format: date
//  *               address:
//  *                 type: string
//  *               nationality:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *                 enum: [Active, In Active, Blocked]
//  *               department:
//  *                 type: string
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *               maritalStatus:
//  *                 type: string
//  *                 enum: [single, married]
//  *               degree:
//  *                 type: string
//  *               university:
//  *                 type: string
//  *               passingYear:
//  *                 type: string
//  *               percentage:
//  *                 type: number
//  *               mobileNumber:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *                 format: email
//  *     responses:
//  *       201:
//  *         description: Staff created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: success
//  *                 message:
//  *                   type: string
//  *                   example: Staff Created Successfully
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: integer
//  *                       example: 9
//  *                     role:
//  *                       type: string
//  *                       example: tester
//  *                     position:
//  *                       type: string
//  *                       example: junior
//  *                     joiningDate:
//  *                       type: string
//  *                       format: date
//  *                       example: 2025-05-13
//  *                     firstName:
//  *                       type: string
//  *                       example: tester
//  *                     lastName:
//  *                       type: string
//  *                       example: man
//  *                     age:
//  *                       type: integer
//  *                       example: 40
//  *                     gender:
//  *                       type: string
//  *                       example: male
//  *                     dob:
//  *                       type: string
//  *                       format: date
//  *                       example: 2025-05-13
//  *                     address:
//  *                       type: string
//  *                       example: patan
//  *                     nationality:
//  *                       type: string
//  *                       example: Afghan
//  *                     status:
//  *                       type: string
//  *                       example: Active
//  *                     department:
//  *                       type: string
//  *                       example: IT
//  *                     maritalStatus:
//  *                       type: string
//  *                       example: single
//  *                     degree:
//  *                       type: string
//  *                       example: BCA
//  *                     university:
//  *                       type: string
//  *                       example: LJKU
//  *                     passingYear:
//  *                       type: string
//  *                       example: 2025
//  *                     percentage:
//  *                       type: number
//  *                       example: 89
//  *                     mobileNumber:
//  *                       type: string
//  *                       example: 9314334930
//  *                     email:
//  *                       type: string
//  *                       example: tester@gmail.com
//  *                     image:
//  *                       type: string
//  *                       format: uri
//  *                       example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1747115701/staffs/watch-testing.jpg
//  *                     createdAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-13T09:08:45.999Z
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-13T09:08:45.999Z
//  */

router.post("/", checkAdminLogin, upload.single("image"), createStaff);

// /**
//  * @swagger
//  * /api/staff/getAllStaffs:
//  *   get:
//  *     summary: Get all staff members
//  *     tags: [Staff]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: sortBy
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: order
//  *         schema:
//  *           type: string
//  *           enum: [ASC, DESC]
//  *     responses:
//  *       200:
//  *         description: List of staff members
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: success
//  *                 message:
//  *                   type: string
//  *                   example: Staff Data Fetched Successfully
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     total:
//  *                       type: integer
//  *                       example: 5
//  *                     page:
//  *                       type: integer
//  *                       example: 1
//  *                     pageSize:
//  *                       type: integer
//  *                       example: 10
//  *                     staffs:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         properties:
//  *                           BasicInfo:
//  *                             type: object
//  *                             properties:
//  *                               empId:
//  *                                 type: integer
//  *                                 example: 7
//  *                               role:
//  *                                 type: string
//  *                                 example: teacher
//  *                               position:
//  *                                 type: string
//  *                                 example: Senior
//  *                               joiningDate:
//  *                                 type: string
//  *                                 format: date
//  *                                 example: 2022-01-15
//  *                               firstName:
//  *                                 type: string
//  *                                 example: Ahmed
//  *                               lastName:
//  *                                 type: string
//  *                                 example: Khan
//  *                           PersonalInfo:
//  *                             type: object
//  *                             properties:
//  *                               age:
//  *                                 type: integer
//  *                                 example: 40
//  *                               gender:
//  *                                 type: string
//  *                                 example: male
//  *                               dob:
//  *                                 type: string
//  *                                 format: date
//  *                                 example: 1993-05-21
//  *                               address:
//  *                                 type: string
//  *                                 example: 123 Main St, NY
//  *                               nationality:
//  *                                 type: string
//  *                                 example: Indian
//  *                               profilePic:
//  *                                 type: string
//  *                                 format: uri
//  *                                 example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1746792638/staffs/book-testing.jpg
//  *                               maritalStatus:
//  *                                 type: string
//  *                                 example: married
//  *                           Qualification:
//  *                             type: array
//  *                             items:
//  *                               type: object
//  *                               properties:
//  *                                 degree:
//  *                                   type: string
//  *                                   example: M.Sc
//  *                                 university:
//  *                                   type: string
//  *                                   example: NYU
//  *                                 passingYear:
//  *                                   type: string
//  *                                   example: 2015
//  *                                 percentage:
//  *                                   type: number
//  *                                   example: 85.6
//  *                           ContactInfo:
//  *                             type: object
//  *                             properties:
//  *                               mobileNumber:
//  *                                 type: string
//  *                                 example: 1234567890
//  *                               email:
//  *                                 type: string
//  *                                 format: email
//  *                                 example: ahmed.khan@example.com
//  *                           OtherInfo:
//  *                             type: object
//  *                             properties:
//  *                               status:
//  *                                 type: string
//  *                                 example: In Active
//  *                               department:
//  *                                 type: string
//  *                                 example: Science
//  */

router.get("/getAllStaffs", checkAdminLogin, getAllStaff);

// /**
//  * @swagger
//  * /api/staff/fetchNationalities:
//  *   get:
//  *     summary: Fetch available nationalities
//  *     tags: [Staff]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of nationalities
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: success
//  *                 message:
//  *                   type: string
//  *                   example: Nationalities fetched successfully
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: string
//  *                   example: [
//  *                     "Afghan",
//  *                     "Albanian",
//  *                     "Algerian",
//  *                     "American",
//  *                     "Andorran",
//  *                     "Angolan",
//  *                     "Argentine",
//  *                     "Armenian",
//  *                     "Australian",
//  *                     "Austrian"
//  *                   ]
//  */

router.get("/fetchNationalities", checkAdminLogin, fetchNationalities);

// /**
//  * @swagger
//  * /api/staff/fetchStatus:
//  *   get:
//  *     summary: Fetch available status values
//  *     tags: [Staff]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of status values
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: success
//  *                 message:
//  *                   type: string
//  *                   example: Status fetched successfully
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: string
//  *                   example: ["Active", "In Active", "Blocked"]
//  */
router.get("/fetchStatus", checkAdminLogin, fetchStatus);

// /**
//  * @swagger
//  * /api/staff/{id}:
//  *   get:
//  *     summary: Get staff member by ID
//  *     tags: [Staff]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Staff member found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: success
//  *                 message:
//  *                   type: string
//  *                   example: Staff Data Fetched Successfully
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     BasicInfo:
//  *                       type: object
//  *                       properties:
//  *                         empId:
//  *                           type: integer
//  *                           example: 7
//  *                         role:
//  *                           type: string
//  *                           example: teacher
//  *                         position:
//  *                           type: string
//  *                           example: Senior
//  *                         joiningDate:
//  *                           type: string
//  *                           format: date
//  *                           example: 2022-01-15
//  *                         firstName:
//  *                           type: string
//  *                           example: Ahmed
//  *                         lastName:
//  *                           type: string
//  *                           example: Khan
//  *                     PersonalInfo:
//  *                       type: object
//  *                       properties:
//  *                         age:
//  *                           type: integer
//  *                           example: 40
//  *                         gender:
//  *                           type: string
//  *                           example: male
//  *                         dob:
//  *                           type: string
//  *                           format: date
//  *                           example: 1993-05-21
//  *                         address:
//  *                           type: string
//  *                           example: 123 Main St, NY
//  *                         nationality:
//  *                           type: string
//  *                           example: Indian
//  *                         profilePic:
//  *                           type: string
//  *                           format: uri
//  *                           example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1746792638/staffs/book-testing.jpg
//  *                         maritalStatus:
//  *                           type: string
//  *                           example: married
//  *                     Qualification:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         properties:
//  *                           degree:
//  *                             type: string
//  *                             example: M.Sc
//  *                           university:
//  *                             type: string
//  *                             example: NYU
//  *                           passingYear:
//  *                             type: string
//  *                             example: 2015
//  *                           percentage:
//  *                             type: number
//  *                             example: 85.6
//  *                     ContactInfo:
//  *                       type: object
//  *                       properties:
//  *                         mobileNumber:
//  *                           type: string
//  *                           example: 1234567890
//  *                         email:
//  *                           type: string
//  *                           format: email
//  *                           example: ahmed.khan@example.com
//  *                     OtherInfo:
//  *                       type: object
//  *                       properties:
//  *                         status:
//  *                           type: string
//  *                           example: In Active
//  *                         department:
//  *                           type: string
//  *                           example: Science
//  */
router.get("/:id", checkAdminLogin, getStaffById);

// /**
//  * @swagger
//  * /api/staff/{id}:
//  *   delete:
//  *     summary: Delete a staff member by ID
//  *     tags: [Staff]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Staff member deleted
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: success
//  *                 message:
//  *                   type: string
//  *                   example: Staff Deleted Successfully
//  *                 data:
//  *                   type: object
//  *                   example: {}
//  */
router.delete("/:id", checkAdminLogin, deleteStaff);

// /**
//  * @swagger
//  * /api/staff/{id}:
//  *   put:
//  *     summary: Update an existing staff member
//  *     tags: [Staff]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               role:
//  *                 type: string
//  *               position:
//  *                 type: string
//  *               joiningDate:
//  *                 type: string
//  *                 format: date
//  *               firstName:
//  *                 type: string
//  *               lastName:
//  *                 type: string
//  *               age:
//  *                 type: integer
//  *               gender:
//  *                 type: string
//  *                 enum: [male, female]
//  *               dob:
//  *                 type: string
//  *                 format: date
//  *               address:
//  *                 type: string
//  *               nationality:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *                 enum: [Active, In Active, Blocked]
//  *               department:
//  *                 type: string
//  *               image:
//  *                 type: string
//  *                 format: binary
//  *               maritalStatus:
//  *                 type: string
//  *                 enum: [single, married]
//  *               degree:
//  *                 type: string
//  *               university:
//  *                 type: string
//  *               passingYear:
//  *                 type: string
//  *               percentage:
//  *                 type: number
//  *               mobileNumber:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *                 format: email
//  *     responses:
//  *       200:
//  *         description: Staff member updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 status:
//  *                   type: string
//  *                   example: success
//  *                 message:
//  *                   type: string
//  *                   example: Staff updated successfully
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: integer
//  *                       example: 8
//  *                     role:
//  *                       type: string
//  *                       example: updated role
//  *                     position:
//  *                       type: string
//  *                       example: updated position
//  *                     joiningDate:
//  *                       type: string
//  *                       format: date
//  *                       example: 2025-05-13
//  *                     firstName:
//  *                       type: string
//  *                       example: updated firstname
//  *                     lastName:
//  *                       type: string
//  *                       example: updated lastname
//  *                     age:
//  *                       type: integer
//  *                       example: 54
//  *                     gender:
//  *                       type: string
//  *                       example: male
//  *                     dob:
//  *                       type: string
//  *                       format: date
//  *                       example: 2025-05-13
//  *                     address:
//  *                       type: string
//  *                       example: updated address
//  *                     nationality:
//  *                       type: string
//  *                       example: Afghan
//  *                     status:
//  *                       type: string
//  *                       example: Active
//  *                     department:
//  *                       type: string
//  *                       example: updated departmennt
//  *                     image:
//  *                       type: string
//  *                       format: uri
//  *                       example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1747116166/staffs/iphone-testing.jpg
//  *                     maritalStatus:
//  *                       type: string
//  *                       example: single
//  *                     degree:
//  *                       type: string
//  *                       example: updated deegree
//  *                     university:
//  *                       type: string
//  *                       example: updated university
//  *                     passingYear:
//  *                       type: string
//  *                       example: 2023
//  *                     percentage:
//  *                       type: number
//  *                       example: 89
//  *                     mobileNumber:
//  *                       type: string
//  *                       example: 9393939393
//  *                     email:
//  *                       type: string
//  *                       format: email
//  *                       example: updated@gmail.com
//  *                     createdAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-13T06:02:47.152Z
//  *                     updatedAt:
//  *                       type: string
//  *                       format: date-time
//  *                       example: 2025-05-13T09:34:36.601Z
//  */
router.put("/:id", checkAdminLogin, upload.single("image"), updateStaff);

export default router;
