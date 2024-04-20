/**
 * @swagger
 * components:
 *   schemas:
 *     Posts:
 *       type: object
 *       required:
 *         - title
 *         - message
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
  getFilteredPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

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
 */
router.get('/posts', asyncWrapper(getFilteredPosts));

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
 *             $ref: '#/components/schemas/Posts'
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Posts'
 */
router.post('/create-post', asyncWrapper(createPost));

router.patch('/update-post', asyncWrapper(updatePost));

/**
 * @swagger
 * /delete-post:
 *   delete:
 *     summary: Remove the post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *
 *     responses:
 *       200:
 *         description: The post was deleted
 *       300:
 *         description: Some error
 *       400:
 *         description: The post was not found
 */
router.delete('/delete-post', asyncWrapper(deletePost));

module.exports = { postRouter: router };
