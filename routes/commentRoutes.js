/**
 * @swagger
 * components:
 *   schemas:
 *     Comments:
 *       type: object
 *       properties:
 *         comment_id:
 *           type: integer
 *           description: The auto-generated id of the comment
 *         user_id:
 *           type: integer
 *           description: id of the user who added this comment
 *         post_id:
 *           type: integer
 *           description: id of the post where wrote this comment
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
 *         - post_id
 *         - message
 *       example:
 *          comment_id: 77
 *          user_id: 93
 *          post_id: 1232
 *          message: 2013 Fire Water Night directed by Virlana Tkacz with Yara Arts Group at La MaMa Experimental Theatre in New York[27]
 *          date_publish: 2024-04-23T13:44:05.312Z
 *          date_update: 2024-04-23T13:44:05.312Z
 */

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The comments managing API
 */

const express = require('express');
const router = express.Router();

const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  createComment,
  updateMyComment,
  getCommentsBelowPost,
  getAllComments,
  deleteComment,
} = require('../controllers/commentControllers');
const { authenticationToken } = require('../middleware/authenticationToken');

/**
 * @swagger
 * /api-v1/post/create-comment:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new comment (need accessToken in header)
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *               - message
 *             properties:
 *               post_id:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       204:
 *         description: The created comment.
 *       400:
 *         description: Error.
 */
router.post(
  '/create-comment',
  authenticationToken,
  asyncWrapper(createComment)
);

/**
 * @swagger
 * /api-v1/post/update-comment:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update comment (need accessToken in header)
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - post_id
 *               - comment_id
 *               - message
 *             properties:
 *               post_id:
 *                 type: integer
 *               comment_id:
 *                 type: integer
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fields updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comments'
 *       400:
 *         description: Error.
 */
router.patch(
  '/update-comment',
  authenticationToken,
  asyncWrapper(updateMyComment)
);

/**
 * @swagger
 * /api-v1/post/comments-below-post:
 *   get:
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         required: true
 *         description: \"post_id\"
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The list of the all comments below post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comments'
 *       400:
 *         description: Error
 */
router.get('/comments-below-post', asyncWrapper(getCommentsBelowPost));

/**
 * @swagger
 * /api-v1/post/all-comments:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns a filtered list of all comments by the one post_id (need accessToken in header)
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         required: false
 *         description: \"post_id\" or \"user_id\"
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: The list of the comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comments'
 *       400:
 *         description: Error
 */
router.get('/all-comments', authenticationToken, asyncWrapper(getAllComments));

/**
 * @swagger
 * /api-v1/post/delete-comment:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove the comment by id (need accessToken in header)
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment_id
 *             properties:
 *               comment_id:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Comment removed.
 *       400:
 *         description: comment_id is required or other errors.
 */
router.delete(
  '/delete-comment',
  authenticationToken,
  asyncWrapper(deleteComment)
);

module.exports = { commentRouter: router };
