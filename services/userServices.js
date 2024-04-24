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

const addUser = async (name, email, role, accessToken) => {
  return new Promise((resolve, reject) => {
    sql = `INSERT INTO users(name, email, role, token, date_register, date_update) VALUES(?,?,?,?,?,?)`;

    return db.run(
      sql,
      [name, email, role, accessToken, dateISO, dateISO],
      (err) => {
        if (err) {
          return reject(err);
        }

        resolve({ status: true });
      }
    );
  });
};

const addToken = async (refreshToken, email) => {
  return new Promise((resolve, reject) => {
    sql = `UPDATE users SET token = ?, date_update = ? WHERE email = ?`;

    return db.run(sql, [refreshToken, dateISO, email], function (err) {
      if (err) {
        return reject(err);
      }

      if (this.changes === 0) {
        return reject({ message: constants.NO_MATCH_USERS });
      }

      resolve({ status: true });
    });
  });
};

const removeToken = async (email) => {
  return new Promise((resolve, reject) => {
    sql = `UPDATE users SET token = ?, date_update = ? WHERE email = ?`;

    return db.run(sql, [null, dateISO, email], function (err) {
      if (err) {
        return reject(err);
      }

      if (this.changes === 0) {
        return reject({ message: constants.NO_MATCH_USERS });
      }

      return resolve({ message: constants.LOGOUT_SUCCESS });
    });
  });
};

const updateFieldsUser = async (
  user_id,
  name,
  sign_plan,
  payment,
  location
) => {
  return new Promise((resolve, reject) => {
    sql = 'UPDATE users SET';
    const params = [];

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'author_id is required',
      });
    }

    if (name) {
      sql += ' name = ?,';
      params.push(name);
    }

    if (sign_plan) {
      sql += ' sign_plan = ?,';
      params.push(sign_plan);
    }

    if (payment) {
      sql += ' payment = ?,';
      params.push(payment);
    }

    if (location) {
      sql += ' location = ?,';
      params.push(location);
    }

    sql += ' date_update = ? WHERE user_id = ?';
    params.push(dateISO);
    params.push(user_id);

    return db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(sql, params, function (err) {
        if (err) {
          return reject(err);
        }

        if (this.changes === 0) {
          return reject({ message: constants.NO_CHANGED });
        }

        db.get(
          'SELECT * FROM users WHERE user_id = ?',
          [user_id],
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

const getUserByEmail = async (email) => {
  if (!email) {
    return 'email is required';
  }

  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM users WHERE email = ?`;

    return db.all(sql, [email], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return resolve({ message: constants.NO_MATCH_USERS });
      }

      return resolve(rows[0]);
    });
  });
};

const getUserByToken = async (refreshToken) => {
  if (!refreshToken) {
    return 'refreshToken is required';
  }

  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM users WHERE token = ?`;

    return db.all(sql, [refreshToken], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return resolve({ message: constants.NO_MATCH_USERS });
      }

      return resolve(rows[0]);
    });
  });
};

const getAllUsers = async () => {
  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM users`;

    return db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      if (rows.length < 1) {
        return resolve({ message: constants.NO_MATCH_USERS });
      }

      return resolve(rows);
    });
  });
};

const removeUser = async (user_id) => {
  return new Promise((resolve, reject) => {
    sql = `DELETE FROM users WHERE user_id = ?`;

    return db.run(sql, [user_id], function (err) {
      if (err) {
        if (err) {
          return reject(err);
        }
      }

      if (this.changes === 0) {
        return reject({ message: constants.NO_MATCH_USERS });
      }

      resolve({ status: true });
    });
  });
};

module.exports = {
  addUser,
  addToken,
  removeToken,
  updateFieldsUser,
  getUserByToken,
  getUserByEmail,
  getAllUsers,
  removeUser,
};
