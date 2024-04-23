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
    sql = `INSERT INTO books(author_id, title, description, cover_image_url, literary_genre,
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
const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    sql = `SELECT * FROM books`;

    return db.all(sql, [], (err, rows) => {
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

//const updateFieldsPost = (author_id, post_id, title, message) => {
//  return new Promise((resolve, reject) => {
//    sql = 'UPDATE posts SET';
//    const params = [];

//    if (title) {
//      sql += ' title = ?,';
//      params.push(title);
//    }

//    if (message) {
//      sql += ' message = ?,';
//      params.push(message);
//    }

//    sql += ' date_update = ? WHERE author_id = ? AND post_id = ?';
//    params.push(dateISO);
//    params.push(author_id);
//    params.push(post_id);

//    return db.serialize(() => {
//      db.run('BEGIN TRANSACTION');

//      db.run(sql, params, function (err) {
//        if (err) {
//          return reject(err);
//        }

//        if (this.changes === 0) {
//          reject({
//            message: `Post with id: ${post_id} by author_id: ${author_id} not found`,
//          });
//        }

//        db.get(
//          'SELECT * FROM posts WHERE post_id = ?',
//          [post_id],
//          (err, row) => {
//            if (err) {
//              db.run('ROLLBACK');
//              return reject(err);
//            }

//            db.run('COMMIT');
//            resolve({ status: true, data: row });
//          }
//        );
//      });
//    });
//  });
//};

// need write pagination query
//const getPostsByQuery = (author_id, field, value) => {
//  return new Promise((resolve, reject) => {
//    sql = `SELECT * FROM posts WHERE`;
//    if (field && value) {
//      sql += ` ${field} LIKE '%${value}%' AND`;
//    }
//    sql += ` author_id = ?`;

//    return db.all(sql, [author_id], (err, rows) => {
//      if (err) {
//        return reject(err);
//      }

//      if (rows.length < 1) {
//        return reject({ message: 'No match posts' });
//      }

//      return resolve(rows);
//    });
//  });
//};

//const removePost = (post_id, author_id) => {
//  return new Promise((resolve, reject) => {
//    sql = `DELETE FROM posts WHERE post_id = ? AND author_id = ?`;

//    return db.run(sql, [post_id, author_id], function (err) {
//      if (err) {
//        return reject(err);
//      }

//      if (this.changes === 0) {
//        reject({ message: 'Not removed' });
//      }

//      return resolve({ status: true });
//    });
//  });
//};

module.exports = {
  addBook,
  getAllBooks,
};
