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
 *         description:
 *           type: string
 *           description: The description of this book
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
 *         - description
 *       example:
 *          book_id: 43
 *          author_id: 7
 *          title: The Lord of the Rings: Return to Moria
 *          description: The Lord of the Rings: Return to Moria is a 2023 survival-crafting video game developed by Free Range Games and published by North Beach Games on October 24, 2023. It is based on the fictional world of Middle-earth created by J. R. R. Tolkien and takes place during its Fourth Age after the events of the The Lord of the Rings novels. It follows a company of dwarves as they try to retake their homeland Moria and restore the long-lost ancient kingdom of Khazad-dûm.
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
const { createBook, getBooks } = require('../controllers/bookControllers');
const { authenticationToken } = require('../middleware/authenticationToken');

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
 *               - author_id
 *               - title
 *               - message
 *             properties:
 *               author_id:
 *                 type: integer
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
router.post('/create-book', asyncWrapper(createBook));

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
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
router.get('/books', asyncWrapper(getBooks));

module.exports = { bookRouter: router };
