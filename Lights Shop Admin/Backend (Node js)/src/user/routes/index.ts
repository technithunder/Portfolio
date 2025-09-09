import express from "express";
import { upload } from "@/middlewares/upload";
import {
  activeUser,
  addAddress,
  changePassword,
  createUser,
  deleteAddress,
  deleteUser,
  forgetPassword,
  getAddressByID,
  getAllAddress,
  getAllAddressWithoutPagination,
  getAllDeletedUser,
  getAllUser,
  getAllUserWithoutPagination,
  getUserById,
  resetPassword,
  restoreDeletedUser,
  updateAddress,
  updateUser,
  userSignup,
} from "../controllers/userController";
import { checkAdminLogin } from "@/middlewares/authMiddleware";
const router = express.Router();

/**
 * @swagger
 * /api/user/add:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [staff, dealer]
 *               position:
 *                 type: string
 *               joiningDate:
 *                 type: string
 *                 format: date
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               dob:
 *                 type: string
 *                 format: date
 *               nationality:
 *                 type: string
 *                 enum: [
 *                   Afghan, Albanian, Algerian, American, Andorran, Angolan, Argentine,
 *                   Armenian, Australian, Austrian, Azerbaijani, Bangladeshi, Belgian,
 *                   Brazilian, British, Bulgarian, Canadian, Chilean, Chinese, Colombian,
 *                   Croatian, Czech, Danish, Dutch, Egyptian, Estonian, Finnish, French,
 *                   Georgian, German, Greek, Hungarian, Icelandic, Indian, Indonesian,
 *                   Iranian, Iraqi, Irish, Israeli, Italian, Japanese, Jordanian, Kazakh,
 *                   Kenyan, Korean, Kuwaiti, Latvian, Lebanese, Lithuanian, Malaysian,
 *                   Mexican, Moroccan, Nepalese, New Zealander, Nigerian, Norwegian,
 *                   Pakistani, Peruvian, Philippine, Polish, Portuguese, Qatari, Romanian,
 *                   Russian, Saudi, Serbian, Singaporean, Slovak, Slovenian, South African,
 *                   Spanish, Sri Lankan, Swedish, Swiss, Syrian, Taiwanese, Thai, Tunisian,
 *                   Turkish, Ukrainian, Emirati, Venezuelan, Vietnamese, Yemeni
 *                 ]
 *               status:
 *                 type: string
 *                 enum: [Active, In Active, Blocked]
 *               department:
 *                 type: string
 *               discount:
 *                 type: string
 *               earning:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               maritalStatus:
 *                 type: string
 *                 enum: [single, married]
 *               qualification:
 *                 type: object
 *                 required:
 *                   - degree
 *                   - university
 *                   - passingYear
 *                   - percentage
 *                 properties:
 *                   degree:
 *                     type: string
 *                     example: BCA
 *                   university:
 *                     type: string
 *                     example: LJKU
 *                   passingYear:
 *                     type: string
 *                     example: "2025"
 *                   percentage:
 *                     type: number
 *                     example: 89.5
 *               address:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - country
 *                   - zipCode
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: BCA
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               mobileNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 9
 *                     role:
 *                       type: string
 *                       example: staff
 *                     position:
 *                       type: string
 *                       example: junior
 *                     joiningDate:
 *                       type: string
 *                       format: date
 *                       example: 2025-05-13
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     age:
 *                       type: integer
 *                       example: 40
 *                     gender:
 *                       type: string
 *                       example: male
 *                     dob:
 *                       type: string
 *                       format: date
 *                       example: 1985-08-15
 *                     address:
 *                       type: string
 *                       example: Patan
 *                     nationality:
 *                       type: string
 *                       example: Afghan
 *                     status:
 *                       type: string
 *                       example: Active
 *                     department:
 *                       type: string
 *                       example: IT
 *                     maritalStatus:
 *                       type: string
 *                       example: single
 *                     qualification:
 *                       type: object
 *                       properties:
 *                         degree:
 *                           type: string
 *                           example: BCA
 *                         university:
 *                           type: string
 *                           example: LJKU
 *                         passingYear:
 *                           type: string
 *                           example: "2025"
 *                         percentage:
 *                           type: number
 *                           example: 89.5
 *                     mobileNumber:
 *                       type: string
 *                       example: 9314334930
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1747115701/staffs/watch-testing.jpg
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T09:08:45.999Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T09:08:45.999Z
 */
router.post("/add", upload.single("image"), createUser);

/**
 * @swagger
 * /api/user/signUp:
 *   post:
 *     summary: User SignUp
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [staff, dealer]

 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               Password:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 9
 *                     role:
 *                       type: string
 *                       example: tester
 *                     firstName:
 *                       type: string
 *                       example: tester
 *                     lastName:
 *                       type: string
 *                       example: man
 *                     Password:
 *                       type: string
 *                       example: pass@123
 *                     email:
 *                       type: string
 *                       example: tester@gmail.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T09:08:45.999Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T09:08:45.999Z
 */
router.post("/signUp", userSignup);

/**
 * @swagger
 * /api/user/getAllUsers:
 *   get:
 *     summary: Get all User members
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: List of staff members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Staff Data Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     staffs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           BasicInfo:
 *                             type: object
 *                             properties:
 *                               empId:
 *                                 type: integer
 *                                 example: 7
 *                               role:
 *                                 type: string
 *                                 example: teacher
 *                               position:
 *                                 type: string
 *                                 example: Senior
 *                               joiningDate:
 *                                 type: string
 *                                 format: date
 *                                 example: 2022-01-15
 *                               firstName:
 *                                 type: string
 *                                 example: Ahmed
 *                               lastName:
 *                                 type: string
 *                                 example: Khan
 *                           PersonalInfo:
 *                             type: object
 *                             properties:
 *                               age:
 *                                 type: integer
 *                                 example: 40
 *                               gender:
 *                                 type: string
 *                                 example: male
 *                               dob:
 *                                 type: string
 *                                 format: date
 *                                 example: 1993-05-21
 *                               address:
 *                                 type: string
 *                                 example: 123 Main St, NY
 *                               nationality:
 *                                 type: string
 *                                 example: Indian
 *                               profilePic:
 *                                 type: string
 *                                 format: uri
 *                                 example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1746792638/staffs/book-testing.jpg
 *                               maritalStatus:
 *                                 type: string
 *                                 example: married
 *                           Qualification:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 degree:
 *                                   type: string
 *                                   example: M.Sc
 *                                 university:
 *                                   type: string
 *                                   example: NYU
 *                                 passingYear:
 *                                   type: string
 *                                   example: 2015
 *                                 percentage:
 *                                   type: number
 *                                   example: 85.6
 *                           ContactInfo:
 *                             type: object
 *                             properties:
 *                               mobileNumber:
 *                                 type: string
 *                                 example: 1234567890
 *                               email:
 *                                 type: string
 *                                 format: email
 *                                 example: ahmed.khan@example.com
 *                           OtherInfo:
 *                             type: object
 *                             properties:
 *                               status:
 *                                 type: string
 *                                 example: In Active
 *                               department:
 *                                 type: string
 *                                 example: Science
 */
router.get("/getAllUsers", getAllUser);

/**
 * @swagger
 * /api/user/get-user/{id}:
 *   get:
 *     summary: Get user member by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User member found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User Data Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     BasicInfo:
 *                       type: object
 *                       properties:
 *                         empId:
 *                           type: integer
 *                           example: 7
 *                         role:
 *                           type: string
 *                           example: teacher
 *                         position:
 *                           type: string
 *                           example: Senior
 *                         joiningDate:
 *                           type: string
 *                           format: date
 *                           example: 2022-01-15
 *                         firstName:
 *                           type: string
 *                           example: Ahmed
 *                         lastName:
 *                           type: string
 *                           example: Khan
 *                     PersonalInfo:
 *                       type: object
 *                       properties:
 *                         age:
 *                           type: integer
 *                           example: 40
 *                         gender:
 *                           type: string
 *                           example: male
 *                         dob:
 *                           type: string
 *                           format: date
 *                           example: 1993-05-21
 *                         address:
 *                           type: string
 *                           example: 123 Main St, NY
 *                         nationality:
 *                           type: string
 *                           example: Indian
 *                         profilePic:
 *                           type: string
 *                           format: uri
 *                           example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1746792638/staffs/book-testing.jpg
 *                         maritalStatus:
 *                           type: string
 *                           example: married
 *                     Qualification:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           degree:
 *                             type: string
 *                             example: M.Sc
 *                           university:
 *                             type: string
 *                             example: NYU
 *                           passingYear:
 *                             type: string
 *                             example: 2015
 *                           percentage:
 *                             type: number
 *                             example: 85.6
 *                     ContactInfo:
 *                       type: object
 *                       properties:
 *                         mobileNumber:
 *                           type: string
 *                           example: 1234567890
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: ahmed.khan@example.com
 *                     OtherInfo:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: In Active
 *                         department:
 *                           type: string
 *                           example: Science
 */
router.get("/get-user/:id", getUserById);

/**
 * @swagger
 * /api/user/delete-user/{id}:
 *   delete:
 *     summary: Delete a user member by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User member deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User Deleted Successfully
 *                 data:
 *                   type: object
 *                   example: {}
 */
router.delete("/delete-user/:id", deleteUser);

/**
 * @swagger
 * /api/user/update-user/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *               position:
 *                 type: string
 *               joiningDate:
 *                 type: string
 *                 format: date
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               dob:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               nationality:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, In Active, Blocked]
 *               department:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               maritalStatus:
 *                 type: string
 *                 enum: [single, married]
 *               degree:
 *                 type: string
 *               university:
 *                 type: string
 *               passingYear:
 *                 type: string
 *               percentage:
 *                 type: number
 *               mobileNumber:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 8
 *                     role:
 *                       type: string
 *                       example: updated role
 *                     position:
 *                       type: string
 *                       example: updated position
 *                     joiningDate:
 *                       type: string
 *                       format: date
 *                       example: 2025-05-13
 *                     firstName:
 *                       type: string
 *                       example: updated firstname
 *                     lastName:
 *                       type: string
 *                       example: updated lastname
 *                     age:
 *                       type: integer
 *                       example: 54
 *                     gender:
 *                       type: string
 *                       example: male
 *                     dob:
 *                       type: string
 *                       format: date
 *                       example: 2025-05-13
 *                     address:
 *                       type: string
 *                       example: updated address
 *                     nationality:
 *                       type: string
 *                       example: Afghan
 *                     status:
 *                       type: string
 *                       example: Active
 *                     department:
 *                       type: string
 *                       example: updated departmennt
 *                     image:
 *                       type: string
 *                       format: uri
 *                       example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1747116166/staffs/iphone-testing.jpg
 *                     maritalStatus:
 *                       type: string
 *                       example: single
 *                     degree:
 *                       type: string
 *                       example: updated deegree
 *                     university:
 *                       type: string
 *                       example: updated university
 *                     passingYear:
 *                       type: string
 *                       example: 2023
 *                     percentage:
 *                       type: number
 *                       example: 89
 *                     mobileNumber:
 *                       type: string
 *                       example: 9393939393
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: updated@gmail.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T06:02:47.152Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T09:34:36.601Z
 */
router.put("/update-user/:id", upload.single("image"), updateUser);

/**
 * @swagger
 * /api/user/forgetPassword:
 *   post:
 *     summary: User Forget Password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 example: Abcd@123
 *     responses:
 *       201:
 *         description: Forget Password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: tester@gmail.com
 *                     password:
 *                       type: string
 *                       example: Abcd@123
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T09:08:45.999Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T09:08:45.999Z
 */
router.post("/forgetPassword", forgetPassword);

/**
 * @swagger
 * /api/user/resetPassword:
 *   post:
 *     summary: User Reset Password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Forget Password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: tester@gmail.com
 *                     password:
 *                       type: string
 *                       example: tester@gmail.com
 *                     token:
 *                       type: string
 *                       example: tester@gmail.com
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T09:08:45.999Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-13T09:08:45.999Z
 */
router.post("/resetPassword", resetPassword);

/**
 * @swagger
 * /api/user/add-address:
 *   post:
 *     summary: Add a new address
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - state
 *               - country
 *               - zipCode
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: All fields are required
 */
router.post("/add-address", checkAdminLogin, addAddress)

/**
 * @swagger
 * /api/user/get-address/{id}:
 *   get:
 *     summary: Get a specific address by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address fetched successfully
 *       404:
 *         description: Address not found
 */
router.get("/get-address/:id", checkAdminLogin, getAddressByID)

/**
 * @swagger
 * /api/user/delete-address/{id}:
 *   delete:
 *     summary: Get a specific address by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address fetched successfully
 *       404:
 *         description: Address not found
 */
router.delete("/delete-address/:id", checkAdminLogin, deleteAddress)

/**
 * @swagger
 * /api/user/update-address/{id}:
 *   put:
 *     summary: Update an existing address by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - state
 *               - country
 *               - zipCode
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               zipCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 */
router.put("/update-address/:id", checkAdminLogin, updateAddress)

/**
 * @swagger
 * /api/user/address-list:
 *   get:
 *     summary: Get paginated list of addresses for current user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword (applies to street, city, state, etc.)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sorting order
 *     responses:
 *       200:
 *         description: Address List Fetch
 */
router.get("/address-list", checkAdminLogin, getAllAddress)

/**
 * @swagger
 * /api/user/user-list:
 *   get:
 *     summary: Get all user members without pagination
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 */
router.get("/user-list", checkAdminLogin, getAllUserWithoutPagination)

/**
 * @swagger
 * /api/user/fetch-address:
 *   get:
 *     summary: Get all address members without pagination
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address fetched successfully
 *       404:
 *         description: Address not found
 */
router.get("/fetch-address", checkAdminLogin, getAllAddressWithoutPagination)



/**
 * @swagger
 * /api/user/active-user/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Active, In Active, Blocked]
 *     responses:
 *       200:
 *         description: User member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Active
 */
router.put("/active-user/:id", checkAdminLogin, activeUser)


/**
 * @swagger
 * /api/user/deleted-staff:
 *   get:
 *     summary: Get all deleted Staff
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: List of staff members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Staff Data Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     staffs:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           BasicInfo:
 *                             type: object
 *                             properties:
 *                               empId:
 *                                 type: integer
 *                                 example: 7
 *                               role:
 *                                 type: string
 *                                 example: teacher
 *                               position:
 *                                 type: string
 *                                 example: Senior
 *                               joiningDate:
 *                                 type: string
 *                                 format: date
 *                                 example: 2022-01-15
 *                               firstName:
 *                                 type: string
 *                                 example: Ahmed
 *                               lastName:
 *                                 type: string
 *                                 example: Khan
 *                           PersonalInfo:
 *                             type: object
 *                             properties:
 *                               age:
 *                                 type: integer
 *                                 example: 40
 *                               gender:
 *                                 type: string
 *                                 example: male
 *                               dob:
 *                                 type: string
 *                                 format: date
 *                                 example: 1993-05-21
 *                               address:
 *                                 type: string
 *                                 example: 123 Main St, NY
 *                               nationality:
 *                                 type: string
 *                                 example: Indian
 *                               profilePic:
 *                                 type: string
 *                                 format: uri
 *                                 example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1746792638/staffs/book-testing.jpg
 *                               maritalStatus:
 *                                 type: string
 *                                 example: married
 *                           Qualification:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 degree:
 *                                   type: string
 *                                   example: M.Sc
 *                                 university:
 *                                   type: string
 *                                   example: NYU
 *                                 passingYear:
 *                                   type: string
 *                                   example: 2015
 *                                 percentage:
 *                                   type: number
 *                                   example: 85.6
 *                           ContactInfo:
 *                             type: object
 *                             properties:
 *                               mobileNumber:
 *                                 type: string
 *                                 example: 1234567890
 *                               email:
 *                                 type: string
 *                                 format: email
 *                                 example: ahmed.khan@example.com
 *                           OtherInfo:
 *                             type: object
 *                             properties:
 *                               status:
 *                                 type: string
 *                                 example: In Active
 *                               department:
 *                                 type: string
 *                                 example: Science
 */
router.get("/deleted-staff", checkAdminLogin, getAllDeletedUser)

/**
 * @swagger
 * /api/user/restore-user/{id}:
 *   get:
 *     summary: Restore user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User member found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User Data Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     BasicInfo:
 *                       type: object
 *                       properties:
 *                         empId:
 *                           type: integer
 *                           example: 7
 *                         role:
 *                           type: string
 *                           example: teacher
 *                         position:
 *                           type: string
 *                           example: Senior
 *                         joiningDate:
 *                           type: string
 *                           format: date
 *                           example: 2022-01-15
 *                         firstName:
 *                           type: string
 *                           example: Ahmed
 *                         lastName:
 *                           type: string
 *                           example: Khan
 *                     PersonalInfo:
 *                       type: object
 *                       properties:
 *                         age:
 *                           type: integer
 *                           example: 40
 *                         gender:
 *                           type: string
 *                           example: male
 *                         dob:
 *                           type: string
 *                           format: date
 *                           example: 1993-05-21
 *                         address:
 *                           type: string
 *                           example: 123 Main St, NY
 *                         nationality:
 *                           type: string
 *                           example: Indian
 *                         profilePic:
 *                           type: string
 *                           format: uri
 *                           example: https://res.cloudinary.com/dvb75ed4h/image/upload/v1746792638/staffs/book-testing.jpg
 *                         maritalStatus:
 *                           type: string
 *                           example: married
 *                     Qualification:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           degree:
 *                             type: string
 *                             example: M.Sc
 *                           university:
 *                             type: string
 *                             example: NYU
 *                           passingYear:
 *                             type: string
 *                             example: 2015
 *                           percentage:
 *                             type: number
 *                             example: 85.6
 *                     ContactInfo:
 *                       type: object
 *                       properties:
 *                         mobileNumber:
 *                           type: string
 *                           example: 1234567890
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: ahmed.khan@example.com
 *                     OtherInfo:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: In Active
 *                         department:
 *                           type: string
 *                           example: Science
 */
router.get("/restore-user/:id", checkAdminLogin, restoreDeletedUser);

/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: Change password for logged-in admin
 *     description: Allows an authenticated admin to change their password by providing the old password and a new password.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []   # Requires JWT token from login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "OldPassword123!"
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword456!"
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Password changed successfully.
 *       400:
 *         description: Old password is incorrect.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Old password is incorrect.
 *       401:
 *         description: Unauthorized - missing or invalid token.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/change-password", checkAdminLogin, changePassword);

export default router;
