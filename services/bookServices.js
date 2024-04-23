const sqlite3 = require('sqlite3').verbose();

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

const addBook = (params) => {
  return new Promise((resolve, reject) => {
    sql = `INSERT INTO books(author_id, title, short_desc, cover_image_url, literary_genre,
      cost, count, date_publish, date_update) VALUES(?,?,?,?,?,?,?,?,?)`;

    return db.run(sql, [...params, dateISO, dateISO], (err) => {
      if (err) {
        return reject(err);
      }

      resolve({ status: true });
    });
  });
};

// need write pagination query
const getBooksByQuery = (field, value) => {
  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM books`;

    if (
      (field == 'cost' ||
        field == 'count' ||
        field == 'book_id' ||
        field == 'author_id') &&
      value
    ) {
      sql += ` WHERE ${field} = ${value}`;
    }

    if (
      (field == 'title' ||
        field == 'short_desc' ||
        field == 'literary_genre') &&
      value
    ) {
      sql += ` WHERE ${field} LIKE '%${value}%'`;
    }
    console.log(sql);
    return db.all(sql, [], function (err, rows) {
      console.log(err);
      
      if (err) {
        return reject(err);
      }
      if (rows.length < 1) {
        return reject({ message: 'No match books' });
      }

      return resolve(rows);
    });
  });
};

module.exports = {
  addBook,
  getBooksByQuery,
};
