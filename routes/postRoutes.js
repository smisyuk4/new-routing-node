/**
 * @swagger
 * components:
 *   schemas:
 *     Posts:
 *       type: object
 *       properties:
 *         post_id:
 *           type: integer
 *           description: The auto-generated id of the post
 *         user_id:
 *           type: integer
 *           description: id of the user who added this post
 *         title:
 *           type: string
 *           description: The title of this post
 *         message:
 *           type: string
 *           description: The message of this post
 *         date_publish:
 *           type: string
 *           description: The date publish of this post
 *         date_update:
 *           type: string
 *           description: The date update of this post
 *       required:
 *         - user_id
 *         - title
 *         - message
 *       example:
 *          post_id: 65
 *          user_id: 12
 *          title: 403 Forbidden
 *          message: The HTTP 403 Forbidden response status code indicates that the server understands the request but refuses to authorize it.
 *          date_publish: 2024-04-23T13:44:05.312Z
 *          date_update: 2024-04-23T13:44:05.312Z
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operations related to posts
 */

const express = require('express');
const router = express.Router();

const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  createPost,
  updatePost,
  getPosts,
  getFilteredPosts,
  deletePost,
} = require('../controllers/postController');
const { authenticationToken } = require('../middleware/authenticationToken');

/**
 * @swagger
 * /api-v1/create-post:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new post (need accessToken in header)
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
 *       204:
 *         description: The created post.
 *       400:
 *         description: Error.
 */
router.post('/create-post', authenticationToken, asyncWrapper(createPost));

/**
 * @swagger
 * /api-v1/update-post:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update post (need accessToken in header)
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *             properties:
 *               post_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fields updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Error.
 */
router.patch('/update-post', authenticationToken, asyncWrapper(updatePost));

/**
 * @swagger
 * /api-v1/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: pageNumber
 *         schema:
 *             type: integer
 *         required: false
 *         description: The page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *             type: integer
 *         required: false
 *         description: The page size
 *     responses:
 *       200:
 *         description: List of posts found.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Error.
 */
router.get('/posts', asyncWrapper(getPosts));

/**
 * @swagger
 * /api-v1/my-posts:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns a filtered list of all posts by the one user (need accessToken in header)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         required: false
 *         description: \"title\" or \"message\"
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: pageNumber
 *         schema:
 *             type: integer
 *         required: false
 *         description: The page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *             type: integer
 *         required: false
 *         description: The page size
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Posts'
 *       400:
 *         description: Error
 */
router.get('/my-posts', authenticationToken, asyncWrapper(getFilteredPosts));

/**
 * @swagger
 * /api-v1/delete-post:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove the post by id (need accessToken in header)
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *             properties:
 *               post_id:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Post removed.
 *       400:
 *         description: post_id is required or other errors.
 */
router.delete('/delete-post', authenticationToken, asyncWrapper(deletePost));

module.exports = { postRouter: router };
