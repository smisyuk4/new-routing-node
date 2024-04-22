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
  const dateISO = new Date().toISOString();
  sql = `INSERT INTO posts(author_id, title, message, date_publish, date_update) VALUES(?,?,?,?,?)`;

  if (!title || !message || !author_id) {
    return res.status(400).json({
      success: false,
      message: 'author_id, title and message required',
    });
  }

  try {
    db.run(sql, [author_id, title, message, dateISO, dateISO], (err) => {
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

const updatePost = async (req, res) => {
  const { post_id, title, message } = req.body;
  const dateISO = new Date().toISOString();
  sql = 'UPDATE posts SET';
  const params = [];

  if (!post_id) {
    return res.status(400).json({
      success: false,
      message: 'post_id is required',
    });
  }

  if (title) {
    sql += ' title = ?,';
    params.push(title);
  }

  if (message) {
    sql += ' message = ?,';
    params.push(message);
  }

  sql += ' date_update = ? WHERE post_id = ?';
  params.push(dateISO);
  params.push(post_id);

  try {
    //generated query as `UPDATE posts SET title = ?, message = ?, date_update = ? WHERE post_id = ?`;
    db.run(sql, params, function (err) {
      if (err) {
        return res.status(300).json({
          success: false,
          error: err,
        });
      }

      if (this.changes === 0) {
        return res.status(300).json({
          success: false,
          message: `Post with id: ${post_id} not found.`,
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

const getAllPosts = async (req, res) => {
  sql = `SELECT * FROM posts`;

  try {
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(300).json({
          success: false,
          error: err,
        });
      }

      if (rows.length < 1) {
        return res.status(300).json({
          success: false,
          error: 'No match posts',
        });
      }

      return res.status(200).json({
        success: true,
        data: rows,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

const getFilteredPosts = async (req, res) => {
  const { author_id } = req.author;
  const queryObject = url.parse(req.url, true).query;

  sql = `SELECT * FROM posts WHERE`;

  if (queryObject.field && queryObject.value) {
    sql += ` ${queryObject.field} LIKE '%${queryObject.value}%' AND`;
  }

  sql += ` author_id = ?`;

  try {
    db.all(sql, [author_id], (err, rows) => {
      if (err) {
        return res.status(300).json({
          success: false,
          error: err,
        });
      }

      if (rows.length < 1) {
        return res.status(300).json({
          success: false,
          error: 'No match posts',
        });
      }

      return res.status(200).json({
        success: true,
        data: rows,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
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
  getAllPosts,
  getFilteredPosts,
  createPost,
  updatePost,
  deletePost,
};
