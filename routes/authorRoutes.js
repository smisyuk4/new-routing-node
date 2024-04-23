/**
 * @swagger
 * components:
 *   schemas:
 *     Authors:
 *       type: object
 *       properties:
 *         author_id:
 *           type: integer
 *           description: The auto-generated id of the author
 *         name:
 *           type: string
 *           description: The name of author
 *         email:
 *           type: string
 *           description: The email of author
 *         location:
 *           type: sting
 *           description: The location of author
 *         avatar_url:
 *           type: sting
 *           description: The avatar url of author
 *         token:
 *           type: sting
 *           description: The refreshToken of author
 *         date_publish:
 *           type: sting
 *           description: The date register of author
 *         date_update:
 *           type: sting
 *           description: The date update profile author
 *       required:
 *         - name
 *         - email
 *       example:
 *          author_id: 32
 *          name: Mary Grabovski
 *          email: mary_gra@gmail.com
 *          location: Spain, Madrid
 *          avatar_url: https://static.vecteezy.com/system/resources/thumbnails/022/714/697/small/cute-black-and-white-girl-posing-vector.jpg
 *          token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoibW1AbW0uY29tIiwiaWF0IjoxNzEzODE5NjQ3fQ.saeTL2QhLu5HrurMTDy5xLL1uCmaLWa31fZonWyxnLU
 *          date_publish: 2024-04-22T21:00:47.748Z
 *          date_update: 2024-04-22T22:05:57.255Z
 */

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: The authors managing API
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
  registerAuthor,
  loginAuthor,
  checkAndGenerateToken,
  logOutAuthor,
  updateAuthorProfile,
  getAuthors,
  deleteAuthor,
} = require('../controllers/authorControllers');
const { authenticationToken } = require('../middleware/authenticationToken');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
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
 *         description: The created post.
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
router.post('/register', asyncWrapper(registerAuthor));

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentication author
 *     tags: [Authors]
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
 *         description: The created post.
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
router.post('/login', asyncWrapper(loginAuthor));

/**
 * @swagger
 * /token:
 *   post:
 *     summary: Refresh accessToken
 *     tags: [Authors]
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
 *     summary: Logout author
 *     tags: [Authors]
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
router.post('/logout', asyncWrapper(logOutAuthor));

/**
 * @swagger
 * /update-author-profile:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update author profile fields (need accessToken in header)
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author_id
 *             properties:
 *               author_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fields updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Authors'
 *       400:
 *         description: author_id is required or other errors.
 */
router.patch(
  '/update-author-profile',
  authenticationToken,
  asyncWrapper(updateAuthorProfile)
);

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of authors found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Authors'
 *       400:
 *         description: Error.
 */
router.get('/authors', asyncWrapper(getAuthors));

/**
 * @swagger
 * /delete-author:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove author profile (need accessToken in header)
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author_id
 *             properties:
 *               author_id:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Profile removed.
 *       400:
 *         description: author_id is required or other errors.
 */
router.delete(
  '/delete-author',
  authenticationToken,
  asyncWrapper(deleteAuthor)
);

module.exports = { authorRouter: router };
