const url = require('url');
const {
  addPost,
  updateFieldsPost,
  getAllPosts,
  getPostsByQuery,
  removePost,
} = require('../services/postServices');

const createPost = async (req, res) => {
  const { user_id, title, message } = req.body;

  if (!user_id || !title || !message) {
    return res.status(400).json({
      message: 'user_id, title and message required',
    });
  }

  try {
    const result = await addPost(user_id, title, message);
    console.log(result);
    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updatePost = async (req, res) => {
  const { user_id } = req.user;
  const { post_id, title, message } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  if (!post_id) {
    return res.status(400).json({
      message: 'post_id is required',
    });
  }

  const checkFields = [title, message].find((item) => item !== undefined);

  if (!checkFields) {
    return res.status(400).json({
      message: 'Need minimum one field for change',
    });
  }

  try {
    const result = await updateFieldsPost(user_id, post_id, title, message);

    if (result?.status) {
      return res.status(200).json(result.data);
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
  const { user_id } = req.user;
  const { field, value } = url.parse(req.url, true).query;

  try {
    const result = await getPostsByQuery(user_id, field, value);

    if (result?.length > 0) {
      return res.status(200).json({ posts: result });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deletePost = async (req, res) => {
  const { user_id } = req.user;
  const { post_id } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  if (!post_id) {
    return res.status(400).json({
      message: 'post_id is required',
    });
  }

  try {
    const result = await removePost(post_id, user_id);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  createPost,
  updatePost,
  getPosts,
  getFilteredPosts,
  deletePost,
};
