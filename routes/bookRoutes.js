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
 *         user_id:
 *           type: integer
 *           description: id of the user who added this book
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
 *           type: array
 *           items:
 *             type: string
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
 *         - user_id
 *         - title
 *         - short_desc
 *       example:
 *          book_id: 43
 *          user_id: 7
 *          title: The Lord of the Rings. Return to Moria
 *          short_desc: The Lord of the Rings. Return to Moria is a 2023 survival-crafting video game developed by Free Range Games and published by North Beach Games on October 24, 2023. It is.
 *          cover_image_url: https://upload.wikimedia.org/wikipedia/en/c/c2/The_Lord_of_the_Rings_Return_to_Moria.png
 *          literary_genre: [Survival-crafting, Tutorial]
 *          cost: 456
 *          count: 100
 *          date_publish: 2024-04-23T13:44:05.312Z
 *          date_update: 2024-04-23T13:44:05.312Z
 *
 *     Genres:
 *       type: object
 *       properties:
 *         genre_id:
 *           type: integer
 *           description: The auto-generated id of the genre
 *         title:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *          genre_id: 11
 *          title: [Survival-crafting, Tutorial]
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   name: Genres
 */

const express = require('express');
const router = express.Router();

const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  createBook,
  updateBook,
  changeBookCover,
  deleteBookCover,
  getFilteredBooks,
  deleteBook,
  createGenre,
  getFilteredGenres,
} = require('../controllers/bookControllers');
const { authenticationToken } = require('../middleware/authenticationToken');
const { multerMid, multerErrorHandling } = require('../middleware/uploadFiles');

/**
 * @swagger
 *  /api-v1/create-book:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new book (need accessToken in header)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - short_desc
 *             properties:
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
router.post('/create-book', authenticationToken, asyncWrapper(createBook));

/**
 * @swagger
 * /api-v1/update-book:
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
 *               literary_genre:
 *                 type: array
 *                 items:
 *                   type: string
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
 * /api-v1/update-book-cover:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Update book cover (need accessToken in header)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *               book_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Fields updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Books'
 *       400:
 *         description: book_id is required or other errors.
 */
router.post(
  '/update-book-cover',
  multerMid.single('cover'),
  multerErrorHandling,
  authenticationToken,
  asyncWrapper(changeBookCover)
);

/**
 * @swagger
 * /api-v1/delete-book-cover:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove book cover (need accessToken in header)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: integer
 *     responses:
 *       204:
 *         description: Avatar removed.
 *       400:
 *         description: book_id is required or other errors.
 */
router.delete(
  '/delete-book-cover',
  authenticationToken,
  asyncWrapper(deleteBookCover)
);

/**
 * @swagger
 * /api-v1/books:
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
 *         description: List of books found.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Books'
 *       400:
 *         description: Error.
 */
router.get('/books', asyncWrapper(getFilteredBooks));

/**
 * @swagger
 * /api-v1/delete-book:
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

/**
 * @swagger
 *  /api-v1/create-genre:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new genre (need accessToken in header)
 *     tags: [Genres]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       204:
 *         description: The created new genre.
 *       400:
 *         description: Error.
 */
router.post('/create-genre', authenticationToken, asyncWrapper(createGenre));

/**
 * @swagger
 * /api-v1/genres:
 *   get:
 *     summary: Get all filtered genres
 *     tags: [Genres]
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
 *         description: List of genres found.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   genre_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *       400:
 *         description: Error.
 */
router.get('/genres', asyncWrapper(getFilteredGenres));

module.exports = { bookRouter: router };
