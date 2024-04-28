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

const addBook = (params) => {
  return new Promise((resolve, reject) => {
    sql = `INSERT INTO books(user_id, title, short_desc, cover_image_url, literary_genre,
      cost, count, date_publish, date_update) VALUES(?,?,?,?,?,?,?,?,?)`;

    return db.run(sql, [...params, dateISO, dateISO], (err) => {
      console.log(sql);
      if (err) {
        return reject(err);
      }

      resolve({ status: true });
    });
  });
};

const updateFieldsBook = ({
  user_id,
  book_id,
  title,
  short_desc,
  cover_image_url,
  literary_genre,
  cost,
  count,
}) => {
  return new Promise((resolve, reject) => {
    sql = 'UPDATE books SET';
    const params = [];

    if (title) {
      sql += ' title = ?,';
      params.push(title);
    }

    if (short_desc) {
      sql += ' short_desc = ?,';
      params.push(short_desc);
    }

    if (cover_image_url || cover_image_url === constants.EMPTY) {
      sql += ' cover_image_url = ?,';
      params.push(cover_image_url);
    }

    if (literary_genre) {
      sql += ' literary_genre = ?,';
      params.push(literary_genre);
    }

    if (cost) {
      sql += ' cost = ?,';
      params.push(cost);
    }

    if (count) {
      sql += ' count = ?,';
      params.push(count);
    }

    sql += ' date_update = ? WHERE user_id = ? AND book_id = ?';
    params.push(dateISO);
    params.push(user_id);
    params.push(book_id);

    return db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(sql, params, function (err) {
        if (err) {
          return reject(err);
        }

        if (this.changes === 0) {
          reject({
            message: `Book with id: ${book_id} by user_id: ${user_id} not found`,
          });
        }

        db.get(
          'SELECT * FROM books WHERE book_id = ?',
          [book_id],
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

const getBooksByQuery = (field, value, pageNumber, pageSize) => {
  const params = [];
  sql = `SELECT * FROM books`;

  if (
    (field == 'cost' ||
      field == 'count' ||
      field == 'book_id' ||
      field == 'user_id') &&
    value
  ) {
    sql += ` WHERE ${field} = ${value}`;
  }

  if (
    (field == 'title' || field == 'short_desc' || field == 'literary_genre') &&
    value
  ) {
    sql += ` WHERE ${field} LIKE '%${value}%'`;
  }

  if (pageNumber && pageSize) {
    sql += ' LIMIT ?, ?';
    const offset = (pageNumber - 1) * pageSize;
    params.push(offset);
    params.push(pageSize);
  }

  return new Promise((resolve, reject) => {
    return db.all(sql, params, function (err, rows) {
      if (err) {
        return reject(err);
      }
      if (rows.length < 1) {
        return reject({ message: constants.NO_MATCH_BOOKS });
      }

      return resolve(rows);
    });
  });
};

const removeBook = (book_id, user_id) => {
  return new Promise((resolve, reject) => {
    sql = `DELETE FROM books WHERE book_id = ? AND user_id = ?`;

    return db.run(sql, [book_id, user_id], function (err) {
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

const addGenre = (title) => {
  return new Promise((resolve, reject) => {
    sql = `INSERT INTO genres(title) VALUES(LOWER(?))`;

    return db.run(sql, [title], (err) => {
      if (err) {
        return reject(err);
      }

      resolve({ status: true });
    });
  });
};

const getGenresByQuery = (field, value) => {
  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM genres`;

    if (field && value) {
      sql += ` WHERE ${field} LIKE '%${value}%'`;
    }

    return db.all(sql, [], function (err, rows) {
      if (err) {
        return reject(err);
      }
      if (rows.length < 1) {
        return reject({ message: constants.NO_MATCH_GENRES });
      }

      return resolve(rows);
    });
  });
};

module.exports = {
  addBook,
  updateFieldsBook,
  getBooksByQuery,
  removeBook,
  addGenre,
  getGenresByQuery,
};
