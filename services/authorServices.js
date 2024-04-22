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
        return reject({ message: 'No match author' });
      }

      return resolve(rows[0]);
    });
  });
};

module.exports = {
  getAuthorByEmail,
};
