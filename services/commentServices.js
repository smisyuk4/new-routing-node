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

const addComment = (user_id, post_id, message) => {
  return new Promise((resolve, reject) => {
    sql = `INSERT INTO comments(user_id, post_id, message, date_publish, date_update) VALUES(?,?,?,?,?)`;

    return db.run(sql, [user_id, post_id, message, dateISO, dateISO], (err) => {
      if (err) {
        return reject(err);
      }

      resolve({ status: true });
    });
  });
};

const updateComment = (user_id, post_id, comment_id, message) => {
  return new Promise((resolve, reject) => {
    const params = [message, dateISO, user_id, post_id, comment_id];
    sql =
      'UPDATE comments SET message = ?, date_update = ? WHERE user_id = ? AND post_id = ? AND comment_id = ?';

    return db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(sql, params, function (err) {
        if (err) {
          return reject(err);
        }

        if (this.changes === 0) {
          reject({
            message: `Comment with id: ${comment_id} by user_id: ${user_id} not found below post_id: ${post_id}`,
          });
        }

        db.get(
          'SELECT * FROM comments WHERE comment_id = ?',
          [comment_id],
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

const getCommentsByQuery = ({ field, value, pageNumber, pageSize }) => {
  const params = [];
  sql = `SELECT * FROM comments`;

  if (field && value) {
    sql += ` WHERE ${field} = ${value}`;
  }

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
        return reject({ message: constants.NO_MATCH_COMMENTS });
      }

      return resolve(rows);
    });
  });
};

const removeComment = (comment_id, user_id) => {
  return new Promise((resolve, reject) => {
    sql = `DELETE FROM comments WHERE comment_id = ? AND user_id = ?`;

    return db.run(sql, [comment_id, user_id], function (err) {
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
  addComment,
  updateComment,
  getCommentsByQuery,
  removeComment,
};
