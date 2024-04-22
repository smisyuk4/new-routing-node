/**
 * @swagger
 * components:
 *   schemas:
 *     Authors:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The title of your post
 *         message:
 *           type: string
 *           description: The message of your post
 *       example:
 *          id: 1
 *          title: React
 *          message: Good tool for dev SPA
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The posts managing API
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
} = require('../controllers/authorControlleer');

/**
 * @swagger
 * /create-post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Posts'
 */
router.post('/register', asyncWrapper(registerAuthor));

router.post('/login', asyncWrapper(loginAuthor));

router.post('/token', asyncWrapper(checkAndGenerateToken));

router.post('/logout', asyncWrapper(logOutAuthor));

/**
 * @swagger
 * /update-post:
 *   patch:
 *     summary: Update post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Post not updated.
 */
router.patch('/update-author-profile', asyncWrapper(updateAuthorProfile));

router.get('/authors', asyncWrapper(getAuthors));

/**
 * @swagger
 * /delete-post:
 *   delete:
 *     summary: Remove the post by id
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The post was deleted
 *       300:
 *         description: Some error
 *       400:
 *         description: The post was not found
 */
router.delete('/delete-author', asyncWrapper(deleteAuthor));

module.exports = { authorRouter: router };
