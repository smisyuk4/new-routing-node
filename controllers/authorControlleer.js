const url = require('url');
const sqlite3 = require('sqlite3').verbose();

// connect to db
let sql;
let db = new sqlite3.Database(
  './posts-new.db',
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  }
);

const registerAuthor = async (req, res) => {
  //const { author_id, title, message } = req.body;
  //const dateISO = new Date().toISOString();
  //sql = `INSERT INTO posts(author_id, title, message, date_publish, date_update) VALUES(?,?,?,?,?)`;
  //if (!title || !message || !author_id) {
  //  return res.status(400).json({
  //    success: false,
  //    message: 'author_id, title and message required',
  //  });
  //}
  //try {
  //  db.run(sql, [author_id, title, message, dateISO, dateISO], (err) => {
  //    if (err) {
  //      return res.status(300).json({
  //        success: false,
  //        error: err,
  //      });
  //    }
  //    res.status(200).json({
  //      success: true,
  //    });
  //  });
  //} catch (error) {
  //  return res.status(400).json({
  //    success: false,
  //  });
  //}
};

const loginAuthor = async (req, res) => {};

const updateAuthorProfile = async (req, res) => {
  //const { post_id, title, message } = req.body;
  //const dateISO = new Date().toISOString();
  //sql = 'UPDATE posts SET';
  //const params = [];
  //if (!post_id) {
  //  return res.status(400).json({
  //    success: false,
  //    message: 'post_id is required',
  //  });
  //}
  //if (title) {
  //  sql += ' title = ?,';
  //  params.push(title);
  //}
  //if (message) {
  //  sql += ' message = ?,';
  //  params.push(message);
  //}
  //sql += ' date_update = ? WHERE post_id = ?';
  //params.push(dateISO);
  //params.push(post_id);
  //try {
  //  //generated query as `UPDATE posts SET title = ?, message = ?, date_update = ? WHERE post_id = ?`;
  //  db.run(sql, params, (err) => {
  //    if (err) {
  //      return res.status(300).json({
  //        success: false,
  //        error: err,
  //      });
  //    }
  //    res.status(200).json({
  //      success: true,
  //    });
  //  });
  //} catch (error) {
  //  return res.status(400).json({
  //    success: false,
  //  });
  //}
};

const deleteAuthor = async (req, res) => {
  //const { post_id } = req.body;
  //sql = `DELETE FROM posts WHERE post_id = ?`;
  //try {
  //  db.run(sql, [post_id], (err) => {
  //    if (err) {
  //      return res.status(300).json({
  //        success: false,
  //        error: err,
  //      });
  //    }
  //    res.status(200).json({
  //      success: true,
  //    });
  //  });
  //} catch (error) {
  //  return res.status(400).json({
  //    success: false,
  //  });
  //}
};

module.exports = {
  registerAuthor,
  loginAuthor,
  updateAuthorProfile,
  deleteAuthor,
};
