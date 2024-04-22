/**
 * @swagger
 * components:
 *   schemas:
 *     Posts:
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
  getAllPosts,
  getFilteredPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { authenticationToken } = require('../middleware/authenticationToken');

router.get('/posts', asyncWrapper(getAllPosts));

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Returns the lists of all the posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         required: false
 *         description: Поле для фільтрації (id, title, message)
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         required: false
 *         description: Значення для фільтрації
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 *       300:
 *         description: Error with reading data to base or no exists
 *       400:
 *         description: Error with reading data to base
 */
router.get('/my-posts', authenticationToken, asyncWrapper(getFilteredPosts));

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
router.post('/create-post', asyncWrapper(createPost));

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
router.patch('/update-post', authenticationToken, asyncWrapper(updatePost));

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
router.delete('/delete-post', authenticationToken, asyncWrapper(deletePost));

module.exports = { postRouter: router };
