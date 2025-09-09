import express from 'express';
import { checkAdminLogin } from '@/middlewares/authMiddleware';
import { upload } from '@/middlewares/upload';
import {
  createDealer,
  deleteDealer,
  getAllDealer,
  getDealerById,
  updateDealer
} from '../controllers/dealerController';

const router = express.Router();

// /**
//  * @swagger
//  * /api/dealer:
//  *   post:
//  *     summary: Create a new dealer member
//  *     tags: [Dealer]
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
//  *         description: Dealer created successfully
//  *         content:
//  *           application/json:
//  *             example:
//  *               status: success
//  *               message: Dealer Created Successfully
//  *               data:
//  *                 id: 2
//  *                 role: fresherr
//  *                 position: junior
//  *                 joiningDate: "2025-05-13"
//  *                 firstName: mk
//  *                 lastName: varaliya
//  *                 age: 32
//  *                 gender: male
//  *                 dob: "2025-05-13"
//  *                 address: ahmedabad
//  *                 nationality: Afghan
//  *                 status: Active
//  *                 maritalStatus: single
//  *                 degree: MCA
//  *                 university: GLS
//  *                 passingYear: "2024"
//  *                 percentage: 0
//  *                 mobileNumber: "9490943939"
//  *                 email: varaliya@gmail.com
//  *                 image: "https://res.cloudinary.com/dvb75ed4h/image/upload/v1747130309/iphone-testing.jpg"
//  *                 createdAt: "2025-05-13T09:58:30.160Z"
//  *                 updatedAt: "2025-05-13T09:58:30.160Z"
//  */
router.post('/', checkAdminLogin, upload.single('image'), createDealer);

// /**
//  * @swagger
//  * /api/dealer/getAllDealers:
//  *   get:
//  *     summary: Get all dealer members
//  *     tags: [Dealer]
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
//  *         description: List of dealer members
//  *         content:
//  *           application/json:
//  *             example:
//  *               status: success
//  *               message: Dealer Data Fetched Successfully
//  *               data:
//  *                 total: 2
//  *                 page: 1
//  *                 pageSize: 10
//  *                 dealers:
//  *                   - BasicInfo:
//  *                       empId: 1
//  *                       role: backend
//  *                       position: Fresherr
//  *                       joiningDate: "2025-05-12"
//  *                       firstName: Dealer
//  *                       lastName: Man
//  *                     PersonalInfo:
//  *                       age: 34
//  *                       gender: male
//  *                       dob: "2025-05-12"
//  *                       address: Ahmedabad
//  *                       nationality: Afghan
//  *                       profilePic: "https://res.cloudinary.com/dvb75ed4h/image/upload/v1747049729/Screenshot%20%2823%29.png"
//  *                       maritalStatus: married
//  *                     Qualification:
//  *                       - degree: BCA
//  *                         university: LJKU
//  *                         passingYear: "2024"
//  *                         percentage: 99
//  *                     ContactInfo:
//  *                       mobileNumber: "9316435760"
//  *                       email: dealer@gmail.com
//  *                     OtherInfo:
//  *                       status: In Active
//  */
router.get('/getAllDealers', checkAdminLogin, getAllDealer);

// /**
//  * @swagger
//  * /api/dealer/{id}:
//  *   get:
//  *     summary: Get dealer member by ID
//  *     tags: [Dealer]
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
//  *         description: Dealer member found
//  *         content:
//  *           application/json:
//  *             example:
//  *               status: success
//  *               message: Dealer Data Fetched Successfully
//  *               data:
//  *                 BasicInfo:
//  *                   empId: 2
//  *                   role: fresherr
//  *                   position: junior
//  *                   joiningDate: "2025-05-13"
//  *                   firstName: mk
//  *                   lastName: varaliya
//  *                 PersonalInfo:
//  *                   age: 32
//  *                   gender: male
//  *                   dob: "2025-05-13"
//  *                   address: ahmedabad
//  *                   nationality: Afghan
//  *                   profilePic: "https://res.cloudinary.com/dvb75ed4h/image/upload/v1747130309/iphone-testing.jpg"
//  *                   maritalStatus: single
//  *                 Qualification:
//  *                   - degree: MCA
//  *                     university: GLS
//  *                     passingYear: "2024"
//  *                     percentage: 0
//  *                 ContactInfo:
//  *                   mobileNumber: "9490943939"
//  *                   email: varaliya@gmail.com
//  *                 OtherInfo:
//  *                   status: Active
//  */
router.get('/:id', checkAdminLogin, getDealerById);

// /**
//  * @swagger
//  * /api/dealer/{id}:
//  *   delete:
//  *     summary: Delete a dealer member by ID
//  *     tags: [Dealer]
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
//  *         description: Dealer member deleted
//  *         content:
//  *           application/json:
//  *             example:
//  *               status: success
//  *               message: Dealer Deleted Successfully
//  *               data: {}
//  */
router.delete('/:id', checkAdminLogin, deleteDealer);

// /**
//  * @swagger
//  * /api/dealer/{id}:
//  *   put:
//  *     summary: Update an existing dealer member
//  *     tags: [Dealer]
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
//  *         description: Dealer member updated successfully
//  *         content:
//  *           application/json:
//  *             example:
//  *               status: success
//  *               message: Dealer Updated Successfully
//  *               data:
//  *                 id: 1
//  *                 role: udated role
//  *                 position: updated position
//  *                 joiningDate: "2025-05-13"
//  *                 firstName: updated firstname
//  *                 lastName: updated lastname
//  *                 age: 34
//  *                 gender: male
//  *                 dob: "2025-05-13"
//  *                 address: updated address
//  *                 nationality: Afghan
//  *                 status: In Active
//  *                 image: "https://res.cloudinary.com/dvb75ed4h/image/upload/v1747131289/book-testing.jpg"
//  *                 maritalStatus: single
//  *                 degree: BBA
//  *                 university: Nirma
//  *                 passingYear: "2021"
//  *                 percentage: 89
//  *                 mobileNumber: "9494949494"
//  *                 email: updated@gmail.com
//  *                 createdAt: "2025-05-12T11:35:29.532Z"
//  *                 updatedAt: "2025-05-13T10:14:50.340Z"
//  */
router.put('/:id', checkAdminLogin, upload.single('image'), updateDealer);

export default router;
