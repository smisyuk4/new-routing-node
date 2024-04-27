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

const addPost = (user_id, title, message) => {
  return new Promise((resolve, reject) => {
    sql = `INSERT INTO posts(user_id, title, message, date_publish, date_update) VALUES(?,?,?,?,?)`;

    return db.run(sql, [user_id, title, message, dateISO, dateISO], (err) => {
      if (err) {
        return reject(err);
      }

      resolve({ status: true });
    });
  });
};

const updateFieldsPost = (user_id, post_id, title, message) => {
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

    sql += ' date_update = ? WHERE user_id = ? AND post_id = ?';
    params.push(dateISO);
    params.push(user_id);
    params.push(post_id);

    return db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(sql, params, function (err) {
        if (err) {
          return reject(err);
        }

        if (this.changes === 0) {
          reject({
            message: `Post with id: ${post_id} by user_id: ${user_id} not found`,
          });
        }

        db.get(
          'SELECT * FROM posts WHERE post_id = ?',
          [post_id],
          (err, row) => {
            if (err) {
              db.run('ROLLBACK');
              return reject(err);
            }

            db.run('COMMIT');
            resolve({ status: true, data: row });
          }
        );
      });
    });
  });
};

const getAllPosts = (pageNumber, pageSize) => {
  sql = 'SELECT * FROM posts';

  const params = [];

  if (pageNumber && pageSize) {
    sql += ' LIMIT ?, ?';
    const offset = (pageNumber - 1) * pageSize;
    params.push(offset);
    params.push(pageSize);
  }

  return new Promise((resolve, reject) => {
    return db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return reject({ message: constants.NO_MATCH_POSTS });
      }

      return resolve(rows);
    });
  });
};

const getPostsByQuery = (user_id, field, value, pageNumber, pageSize) => {
  const params = [];
  sql = `SELECT * FROM posts WHERE`;

  if (field && value) {
    sql += ` ${field} LIKE '%${value}%' AND`;
  }

  sql += ` user_id = ?`;
  params.push(user_id);

  if (pageNumber && pageSize) {
    sql += ' LIMIT ?, ?';
    const offset = (pageNumber - 1) * pageSize;
    params.push(offset);
    params.push(pageSize);
  }

  return new Promise((resolve, reject) => {
    return db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return reject({ message: constants.NO_MATCH_POSTS });
      }

      return resolve(rows);
    });
  });
};

const removePost = (post_id, user_id) => {
  return new Promise((resolve, reject) => {
    sql = `DELETE FROM posts WHERE post_id = ? AND user_id = ?`;

    return db.run(sql, [post_id, user_id], function (err) {
      if (err) {
        return reject(err);
      }

      if (this.changes === 0) {
        reject({ message: constants.NO_REMOVED });
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
