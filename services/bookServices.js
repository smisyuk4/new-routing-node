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

const updateFieldsBook = (
  author_id,
  book_id,
  title,
  short_desc,
  cover_image_url,
  literary_genre,
  cost,
  count
) => {
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

    if (cover_image_url) {
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

    sql += ' date_update = ? WHERE author_id = ? AND book_id = ?';
    params.push(dateISO);
    params.push(author_id);
    params.push(book_id);

    return db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      db.run(sql, params, function (err) {
        if (err) {
          return reject(err);
        }

        if (this.changes === 0) {
          reject({
            message: `Book with id: ${book_id} by author_id: ${author_id} not found`,
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

const removeBook = (book_id, author_id) => {
  return new Promise((resolve, reject) => {
    sql = `DELETE FROM books WHERE book_id = ? AND author_id = ?`;

    return db.run(sql, [book_id, author_id], function (err) {
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
  addBook,
  getBooksByQuery,
  updateFieldsBook,
  removeBook,
};
