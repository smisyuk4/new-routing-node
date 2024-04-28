/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         password:
 *           type: string
 *           description: The password of user
 *         email:
 *           type: string
 *           description: The email of user
 *         role:
 *           type: string
 *           description: The role of user
 *         sign_plan:
 *           type: integer
 *           description: The sign plan
 *         payment:
 *           type: string
 *           description: Payment by sign plan of user
 *         location:
 *           type: string
 *           description: The location of user
 *         avatar_url:
 *           type: string
 *           description: The avatar url of user
 *         refresh_token:
 *           type: string
 *           description: The refresh_token of user
 *         date_register:
 *           type: string
 *           description: The date register of user
 *         date_update:
 *           type: string
 *           description: The date update profile user
 *       required:
 *         - password
 *         - email
 *         - role
 *       example:
 *          user_id: 32
 *          password: asdasdasdwelfwkdsflksdkflkowqkdo3i3201id0iq0id0sadlaksldkmaskdnkansdkasdasldpo0-9898
 *          email: mary_gra@gmail.com
 *          role: author
 *          sign_plan: 3
 *          payment: true
 *          location: Spain, Madrid
 *          avatar_url: https://static.vecteezy.com/system/resources/thumbnails/022/714/697/small/cute-black-and-white-girl-posing-vector.jpg
 *          refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoibW1AbW0uY29tIiwiaWF0IjoxNzEzODE5NjQ3fQ.saeTL2QhLu5HrurMTDy5xLL1uCmaLWa31fZonWyxnLU
 *          date_register: 2024-04-22T21:00:47.748Z
 *          date_update: 2024-04-22T22:05:57.255Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserWithAccessToken:
 *       example:
 *          user_id: 32
 *          email: mary_gra@gmail.com
 *          role: author
 *          sign_plan: 3
 *          payment: true
 *          location: Spain, Madrid
 *          avatar_url: https://static.vecteezy.com/system/resources/thumbnails/022/714/697/small/cute-black-and-white-girl-posing-vector.jpg
 *          refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoibW1AbW0uY29tIiwiaWF0IjoxNzEzODE5NjQ3fQ.saeTL2QhLu5HrurMTDy5xLL1uCmaLWa31fZonWyxnLU
 *          access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYiQxMyQ4NHY1ajRBdHdXckJuYkI5VUt3U3EuamJBOFh2RTdpeE5ZRFV3V200SmNTVGxKbThsOHZ0VyIsImVtYWlsIjoib25lLXR3byIsImlhdCI6MTcxNDIyMDY1NH0.ITh93z3WdyvmO6hhDnnbWuU_RNdXmNhBuGlgd_VFX8gF
 *          date_register: 2024-04-22T21:00:47.748Z
 *          date_update: 2024-04-22T22:05:57.255Z
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: "Bearer <your-accessToken>"
 */

const express = require('express');
const router = express.Router();

const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  register,
  login,
  checkAndGenerateToken,
  logOut,
  updateUserProfile,
  changeUserAvatar,
  deleteUserAvatar,
  changeUserPassword,
  getUsers,
  deleteUser,
  getUserRoles,
  createPlan,
  getAllPlans,
  updatePlan,
  deletePlan,
} = require('../controllers/userControllers');
const { authenticationToken } = require('../middleware/authenticationToken');
const { multerMid, multerErrorHandling } = require('../middleware/uploadFiles');

/**
 * @swagger
 * /api-v1/user/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - email
 *               - role
 *             properties:
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created new profile.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithAccessToken'
 *       400:
 *         description: password and email required or other errors.
 *       409:
 *         description: Email already exists.
 */
router.post('/register', asyncWrapper(register));

/**
 * @swagger
 * /api-v1/user/login:
 *   post:
 *     summary: Authentication user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - email
 *             properties:
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: The authentication successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: password and email required or other errors.
 */
router.post('/login', asyncWrapper(login));

/**
 * @swagger
 * /api-v1/user/token:
 *   post:
 *     summary: Refresh accessToken
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: AccessToken generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Error.
 *       403:
 *         description: Not authorized.
 */
router.post('/token', asyncWrapper(checkAndGenerateToken));

/**
 * @swagger
 * /api-v1/user/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       204:
 *         description: Logout successfully.
 *       400:
 *         description: RefreshToken is required or other errors.
 *       401:
 *         description: Not authorized.
 */
router.post('/logout', asyncWrapper(logOut));

/**
 * @swagger
 * /api-v1/user/update-profile:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update user profile fields (need accessToken in header)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users_id
 *             properties:
 *               sign_plan:
 *                 type: string
 *               payment:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fields updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       400:
 *         description: user_id is required or other errors.
 */
router.patch(
  '/update-profile',
  authenticationToken,
  asyncWrapper(updateUserProfile)
);

/**
 * @swagger
 * /api-v1/user/update-password:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update user password (need accessToken in header)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password_old:
 *                 type: string
 *               password_new:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fields updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       400:
 *         description: user_id is required or other errors.
 */
router.patch(
  '/update-password',
  authenticationToken,
  asyncWrapper(changeUserPassword)
);

/**
 * @swagger
 * /api-v1/user/update-avatar:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Update user avatar (need accessToken in header)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fields updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       400:
 *         description: user_id is required or other errors.
 */
router.post(
  '/update-avatar',
  multerMid.single('avatar'),
  multerErrorHandling,
  authenticationToken,
  asyncWrapper(changeUserAvatar)
);

/**
 * @swagger
 * /api-v1/user/delete-avatar:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove avatar (need accessToken in header)
 *     tags: [Users]
 *     responses:
 *       204:
 *         description: Avatar removed.
 *       400:
 *         description: user_id is required or other errors.
 */
router.delete(
  '/delete-avatar',
  authenticationToken,
  asyncWrapper(deleteUserAvatar)
);

/**
 * @swagger
 * /api-v1/user/all-profiles:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users found.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 *       400:
 *         description: Error.
 */
router.get('/all-profiles', asyncWrapper(getUsers));

/**
 * @swagger
 * /api-v1/user/delete-profile:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove profile (need accessToken in header)
 *     tags: [Users]
 *     responses:
 *       204:
 *         description: Profile removed.
 *       400:
 *         description: user_id is required or other errors.
 */
router.delete('/delete-profile', authenticationToken, asyncWrapper(deleteUser));

/**
 * @swagger
 * /api-v1/user/roles:
 *   get:
 *     summary: Get user roles
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of roles found.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   role_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *       400:
 *         description: Error.
 */
router.get('/roles', asyncWrapper(getUserRoles));

/**
 * @swagger
 * /api-v1/user/create-plan:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new sign plan (need accessToken in header)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - cost
 *             properties:
 *               title:
 *                 type: string
 *               cost:
 *                 type: integer
 *     responses:
 *       204:
 *         description: The created new sing plan.
 *       400:
 *         description: title and cost required or other errors.
 */
router.post('/create-plan', authenticationToken, asyncWrapper(createPlan));

/**
 * @swagger
 * /api-v1/user/plans:
 *   get:
 *     summary: Get sing plans
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of plans found.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   plan_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   cost:
 *                     type: integer
 *       400:
 *         description: Error.
 */
router.get('/plans', asyncWrapper(getAllPlans));

/**
 * @swagger
 * /api-v1/user/update-plan:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update sign plan (need accessToken in header)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               cost:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Fields updated.
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               plan_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               cost:
 *                 type: integer
 *       400:
 *         description: Errors.
 */
router.patch('/update-plan', authenticationToken, asyncWrapper(updatePlan));

/**
 * @swagger
 * /api-v1/user/delete-plan:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove the plan by id (need accessToken in header)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_id
 *             properties:
 *               plan_id:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Plan removed.
 *       400:
 *         description: plan_id is required or other errors.
 */
router.delete('/delete-plan', authenticationToken, asyncWrapper(deletePlan));

module.exports = { userRouter: router };
