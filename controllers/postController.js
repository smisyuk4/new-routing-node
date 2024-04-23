const {
  addPost,
  updateFieldsPost,
  getAllPosts,
  getPostsByQuery,
} = require('../services/postServices');

const url = require('url');
const sqlite3 = require('sqlite3').verbose();

// connect to db
let sql;
const db = new sqlite3.Database(
  './posts-new.db',
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  }
);

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
  sql = `DELETE FROM posts WHERE post_id = ?`;

  try {
    db.run(sql, [post_id], (err) => {
      if (err) {
        return res.status(300).json({
          success: false,
          error: err,
        });
      }

      res.status(200).json({
        success: true,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

module.exports = {
  getPosts,
  getFilteredPosts,
  createPost,
  updatePost,
  deletePost,
};
