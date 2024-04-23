/**
 * @swagger
 * components:
 *   schemas:
 *     Books:
 *       type: object
 *       properties:
 *         book_id:
 *           type: integer
 *           description: The auto-generated id of the book
 *         author_id:
 *           type: integer
 *           description: id of the author this book
 *         title:
 *           type: string
 *           description: The title of this book
 *         short_desc:
 *           type: string
 *           description: The short description about this book
 *         cover_image_url:
 *           type: string
 *           description: The cover image url of this book
 *         literary_genre:
 *           type: string
 *           description: The literary genre of this book
 *         cost:
 *           type: integer
 *           description: The cost of this book
 *         count:
 *           type: integer
 *           description: The count of this book
 *         date_publish:
 *           type: string
 *           description: The date publish of this book
 *         date_update:
 *           type: string
 *           description: The date update of this book
 *       required:
 *         - author_id
 *         - title
 *         - short_desc
 *       example:
 *          book_id: 43
 *          author_id: 7
 *          title: The Lord of the Rings. Return to Moria
 *          short_desc: The Lord of the Rings. Return to Moria is a 2023 survival-crafting video game developed by Free Range Games and published by North Beach Games on October 24, 2023. It is.
 *          cover_image_url: https://upload.wikimedia.org/wikipedia/en/c/c2/The_Lord_of_the_Rings_Return_to_Moria.png
 *          literary_genre: Survival-crafting Tutorial
 *          cost: 456
 *          count: 100
 *          date_publish: 2024-04-23T13:44:05.312Z
 *          date_update: 2024-04-23T13:44:05.312Z
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

const express = require('express');
const router = express.Router();

const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  createBook,
  getFilteredBooks,
  updateBook,
  deleteBook,
} = require('../controllers/bookControllers');
const { authenticationToken } = require('../middleware/authenticationToken');

/**
 * @swagger
 * /create-book:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - author_id
 *               - title
 *               - short_desc
 *             properties:
 *               author_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               short_desc:
 *                 type: string
 *     responses:
 *       204:
 *         description: The created book.
 *       400:
 *         description: Error.
 */
router.post('/create-book', asyncWrapper(createBook));

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all filtered books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: value
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: List of books found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       400:
 *         description: Error.
 */
router.get('/books', asyncWrapper(getFilteredBooks));

/**
 * @swagger
 * /update-book:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update book (need accessToken in header)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *             properties:
 *               book_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               short_desc:
 *                 type: string
 *               cover_image_url:
 *                 type: string
 *               literary_genre:
 *                 type: string
 *               cost:
 *                 type: integer
 *               count:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Fields updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       400:
 *         description: Error.
 */
router.patch('/update-book', authenticationToken, asyncWrapper(updateBook));

/**
 * @swagger
 * /delete-book:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove the book by id (need accessToken in header)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *             properties:
 *               book_id:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Book removed.
 *       400:
 *         description: book_id is required or other errors.
 */
router.delete('/delete-book', authenticationToken, asyncWrapper(deleteBook));

module.exports = { bookRouter: router };
