const express = require('express');
const router = express.Router();

const { asyncWrapper } = require('../helpers/asyncWrapper');
const {
  getFilteredPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

router.get('/posts', asyncWrapper(getFilteredPosts));
router.post('/create-post', asyncWrapper(createPost));
router.patch('/update-post', asyncWrapper(updatePost));
router.delete('/delete-post', asyncWrapper(deletePost));

module.exports = { postRouter: router };
