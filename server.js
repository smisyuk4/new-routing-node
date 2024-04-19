const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');

let sql;
const port = 3000;

// connect to db
let db = new sqlite3.Database('./posts.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/posts', async (req, res) => {
  sql = `SELECT * FROM posts`; // get all data

  const queryObject = url.parse(req.url, true).query;

  if (queryObject.field && queryObject.value) {
    // get selected data
    sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.value}%'`;
  }

  try {
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.json({
          status: 300,
          success: false,
          error: err,
        });
      }

      if (rows.length < 1) {
        return res.json({
          status: 300,
          success: false,
          error: 'No match',
        });
      }

      return res.json({
        status: 200,
        success: true,
        data: rows,
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

app.post('/create-post', async (req, res) => {
  const { title, message } = req.body;

  try {
    // insert data into table
    sql = `INSERT INTO posts(title, message) VALUES(?,?)`;
    db.run(sql, ['Angular', 'fine tool for development power SPA'], (err) => {
      if (err) {
        return res.json({
          status: 300,
          success: false,
          error: err,
        });
      }

      console.log(req.body);
    });

    res.json({
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

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
