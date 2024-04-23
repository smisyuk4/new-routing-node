const sqlite3 = require('sqlite3').verbose();
const { constants } = require('../constants');

// connect to db
let sql;
const dateISO = new Date().toISOString();
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

const addPost = (author_id, title, message) => {
  return new Promise((resolve, reject) => {
    sql = `INSERT INTO posts(author_id, title, message, date_publish, date_update) VALUES(?,?,?,?,?)`;

    return db.run(sql, [author_id, title, message, dateISO, dateISO], (err) => {
      if (err) {
        return reject(err);
      }

      resolve({ status: true });
    });
  });
};

const updateFieldsPost = (post_id, title, message) => {
  return new Promise((resolve, reject) => {
    sql = 'UPDATE posts SET';
    const params = [];

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

    return db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }

      if (this.changes === 0) {
        reject({ message: `Post with id: ${post_id} not found.` });
      }

      return resolve(rows);
    });
  });
};

// need write pagination query
const getAllPosts = () => {
  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM posts`;

    return db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return reject({ message: 'No match posts' });
      }

      return resolve(rows);
    });
  });
};

// need write pagination query
const getPostsByQuery = (author_id, field, value) => {
  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM posts WHERE`;
    if (field && value) {
      sql += ` ${field} LIKE '%${value}%' AND`;
    }
    sql += ` author_id = ?`;

    return db.all(sql, [author_id], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return reject({ message: 'No match posts' });
      }

      return resolve(rows);
    });
  });
};

const removePost = (post_id, author_id) => {
  return new Promise((resolve, reject) => {
    sql = `DELETE FROM posts WHERE post_id = ? AND author_id = ?`;

    return db.run(sql, [post_id, author_id], function (err) {
      if (err) {
        return reject(err);
      }

      if (this.changes === 0) {
        reject({ message: 'Not removed' });
      }

      return resolve({ status: true });
    });
  });
};

module.exports = {
  addPost,
  updateFieldsPost,
  getAllPosts,
  getPostsByQuery,
  removePost,
};
