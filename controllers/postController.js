const url = require('url');
const {
  addPost,
  updateFieldsPost,
  getAllPosts,
  getPostsByQuery,
  removePost,
} = require('../services/postServices');


const createPost = async (req, res) => {
  const { author_id, title, message } = req.body;

  if (!author_id || !title || !message) {
    return res.status(400).json({
      message: 'author_id, title and message required',
    });
  }

  try {
    const result = await addPost(author_id, title, message);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updatePost = async (req, res) => {
  const { post_id, title, message } = req.body;

  if (!post_id) {
    return res.status(400).json({
      message: 'post_id is required',
    });
  }

  try {
    const result = await updateFieldsPost(post_id, title, message);
    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getPosts = async (req, res) => {
  try {
    const result = await getAllPosts();
    if (result?.length > 0) {
      return res.status(200).json({ posts: result });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getFilteredPosts = async (req, res) => {
  const { author_id } = req.author;
  const { field, value } = url.parse(req.url, true).query;

  try {
    const result = await getPostsByQuery(author_id, field, value);

    if (result?.length > 0) {
      return res.status(200).json({ posts: result });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deletePost = async (req, res) => {
  const { post_id } = req.body;
  const { author_id } = req.author;

  if (!post_id) {
    return res.status(400).json({
      message: 'post_id is required',
    });
  }

  if (!author_id) {
    return res.status(400).json({
      message: 'author_id is required',
    });
  }

  try {
    const result = await removePost(post_id, author_id);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  getPosts,
  getFilteredPosts,
  createPost,
  updatePost,
  deletePost,
};
