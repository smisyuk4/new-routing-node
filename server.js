const express = require('express');
const sqlite3 = require('sqlite3').verbose();
let sql;
const app = express();
const port = 3000;

app.post('/create-post', async (req, res) => {
  const { title, message } = req.body;

  res.status(200).send({ result: 'created' });

  //res.status(500).send({ error });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// connect to db
let db = new sqlite3.Database('./posts.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

// create table
//sql = `CREATE TABLE posts(id INTEGER PRIMARY KEY,title,message)`;
//db.run(sql);

// drop table
//db.run('DROP TABLE posts');

// insert data into table
//sql = `INSERT INTO posts(title, message) VALUES(?,?)`;
//db.run(sql, ['Angular', 'fine tool for development power SPA'], (err) => {
//  if (err) {
//    return console.error(err.message);
//  }
//});

// update data
//sql = `UPDATE posts SET title = ? WHERE id = ?`;
//db.run(sql, [
//  'Next.js',
//  1],
//  (err) => {
//    if (err) {
//      return console.error(err.message);
//    }
//  },
//);

// delete data
//sql = `DELETE FROM posts WHERE id = ?`;
//db.run(sql, [
//  1,
//  (err) => {
//    if (err) {
//      return console.error(err.message);
//    }
//  },
//]);

// query the data
sql = `SELECT * FROM posts`;
db.all(sql, [], (err, rows) => {
  if (err) {
    return console.error(err.message);
  }

  rows.forEach((row) => {
    console.log(row);
  });
});
