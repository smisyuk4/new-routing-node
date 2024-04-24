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
 *         name:
 *           type: string
 *           description: The name of user
 *         email:
 *           type: string
 *           description: The email of user
 *         role:
 *           type: string
 *           description: The role of user
 *         payment:
 *           type: string
 *           description: Payment by sign plan of user
 *         location:
 *           type: sting
 *           description: The location of user
 *         avatar_url:
 *           type: sting
 *           description: The avatar url of user
 *         token:
 *           type: sting
 *           description: The refreshToken of user
 *         date_register:
 *           type: sting
 *           description: The date register of user
 *         date_update:
 *           type: sting
 *           description: The date update profile user
 *       required:
 *         - name
 *         - email
 *         - role
 *       example:
 *          user_id: 32
 *          name: Mary Grabovski
 *          email: mary_gra@gmail.com
 *          role: author
 *          sign_plan: 1 month
 *          payment: true
 *          location: Spain, Madrid
 *          avatar_url: https://static.vecteezy.com/system/resources/thumbnails/022/714/697/small/cute-black-and-white-girl-posing-vector.jpg
 *          token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoibW1AbW0uY29tIiwiaWF0IjoxNzEzODE5NjQ3fQ.saeTL2QhLu5HrurMTDy5xLL1uCmaLWa31fZonWyxnLU
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
  getUsers,
  deleteUser,
} = require('../controllers/userControllers');
const { authenticationToken } = require('../middleware/authenticationToken');

/**
 * @swagger
 * /register:
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
 *               - name
 *               - email
 *               - role
 *             properties:
 *               name:
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
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Name and email required or other errors.
 *       409:
 *         description: Email already exists.
 */
router.post('/register', asyncWrapper(register));

/**
 * @swagger
 * /login:
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
 *               - name
 *               - email
 *             properties:
 *               name:
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
 *         description: Name and email required or other errors.
 */
router.post('/login', asyncWrapper(login));

/**
 * @swagger
 * /token:
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
 * /logout:
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
 * /update-profile:
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
 *               users_id:
 *                 type: integer
 *               name:
 *                 type: string
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
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       400:
 *         description: Error.
 */
router.get('/users', asyncWrapper(getUsers));

/**
 * @swagger
 * /delete-profile:
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

module.exports = { userRouter: router };
