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

const addAuthor = async (name, email, accessToken) => {
  return new Promise((resolve, reject) => {
    sql = `INSERT INTO authors(name, email, token, date_publish, date_update) VALUES(?,?,?,?,?)`;

    return db.run(sql, [name, email, accessToken, dateISO, dateISO], (err) => {
      if (err) {
        return reject(err);
      }

      resolve({ status: true });
    });
  });
};

const addToken = async (refreshToken, email) => {
  return new Promise((resolve, reject) => {
    sql = `UPDATE authors SET token = ?, date_update = ? WHERE email = ?`;

    return db.run(sql, [refreshToken, dateISO, email], function (err) {
      if (err) {
        return reject(err);
      }

      if (this.changes === 0) {
        return reject({ message: 'No match author' });
      }

      resolve({ status: true });
    });
  });
};

const removeToken = async (email) => {
  return new Promise((resolve, reject) => {
    sql = `UPDATE authors SET token = ?, date_update = ? WHERE email = ?`;

    return db.run(sql, [null, dateISO, email], function (err) {
      if (err) {
        return reject(err);
      }

      if (this.changes === 0) {
        return reject({ message: 'No match author' });
      }

      return resolve({ message: constants.LOGOUT_SUCCESS });
    });
  });
};

const updateFieldsAuthor = async (author_id, name, location, avatar_url) => {
  return new Promise((resolve, reject) => {
    sql = 'UPDATE authors SET';
    const params = [];

    if (!author_id) {
      return res.status(400).json({
        success: false,
        message: 'author_id is required',
      });
    }

    if (name) {
      sql += ' name = ?,';
      params.push(name);
    }

    if (location) {
      sql += ' location = ?,';
      params.push(location);
    }

    if (avatar_url) {
      sql += ' avatar_url = ?,';
      params.push(avatar_url);
    }

    sql += ' date_update = ? WHERE author_id = ?';
    params.push(dateISO);
    params.push(author_id);

    return db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(sql, params, function (err) {
        if (err) {
          return reject(err);
        }

        if (this.changes === 0) {
          return reject({ message: 'No changed' });
        }

        db.get(
          'SELECT * FROM authors WHERE author_id = ?',
          [author_id],
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
        return resolve({ message: constants.NO_MATCH_AUTHOR });
      }

      return resolve(rows[0]);
    });
  });
};

const getAuthorByToken = async (refreshToken) => {
  if (!refreshToken) {
    return 'refreshToken is required';
  }

  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM authors WHERE token = ?`;

    return db.all(sql, [refreshToken], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return resolve({ message: constants.NO_MATCH_AUTHOR });
      }

      return resolve(rows[0]);
    });
  });
};

const getAllAuthors = async () => {
  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM authors`;

    return db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return resolve({ message: constants.NO_MATCH_AUTHOR });
      }

      return resolve(rows);
    });
  });
};

const removeAuthor = async (author_id) => {
  return new Promise((resolve, reject) => {
    sql = `DELETE FROM authors WHERE author_id = ?`;

    return db.run(sql, [author_id], function (err) {
      if (err) {
        if (err) {
          return reject(err);
        }
      }

      if (this.changes === 0) {
        return resolve({ message: constants.NO_MATCH_AUTHOR });
      }

      resolve({ status: true });
    });
  });
};

module.exports = {
  addAuthor,
  addToken,
  removeToken,
  updateFieldsAuthor,
  getAuthorByEmail,
  getAuthorByToken,
  getAllAuthors,
  removeAuthor,
};
