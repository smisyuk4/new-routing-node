const sqlite3 = require('sqlite3').verbose();
const { constants } = require('../constants');

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

const getAuthorByEmail = async (email) => {
  if (!email) {
    return 'email is required';
  }

  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM authors WHERE email = ?`;

    return db.all(sql, [email], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return reject({ message: constants.NO_MATCH_AUTHOR });
      }

      return resolve(rows[0]);
    });
  });
};

const getAuthorToken = async (token) => {
  if (!token) {
    return 'token is required';
  }

  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM authors WHERE token = ?`;

    return db.all(sql, [token], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return reject({ message: 'No match author' });
      }

      return resolve(rows[0]);
    });
  });
};

module.exports = {
  getAuthorByEmail,
  getAuthorToken,
};
