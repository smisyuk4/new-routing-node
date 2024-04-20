const url = require('url');
const sqlite3 = require('sqlite3').verbose();

// connect to db
let sql;
let db = new sqlite3.Database('./posts.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

const getFilteredPosts = async (req, res) => {
  sql = `SELECT * FROM posts`; // get all data

  const queryObject = url.parse(req.url, true).query;

  if (queryObject.field && queryObject.value) {
    // get filtered data
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
};

const createPost = async (req, res) => {
  const { title, message } = req.body;
  sql = `INSERT INTO posts(title, message) VALUES(?,?)`;

  if (!title || !message) {
    return res.json({
      status: 400,
      success: false,
      message: 'title and message required',
    });
  }

  try {
    db.run(sql, [title, message], (err) => {
      if (err) {
        return res.json({
          status: 300,
          success: false,
          error: err,
        });
      }

      res.json({
        status: 200,
        success: true,
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
};

const updatePost = async (req, res) => {
  const { id, title, message } = req.body;
  sql = 'UPDATE posts SET';
  const params = [];

  if (title) {
    sql += ' title = ?,';
    params.push(title);
  }

  if (message) {
    sql += ' message = ?,';
    params.push(message);
  }

  // remove last coma
  sql = sql.slice(0, -1);
  sql += ' WHERE id = ?';
  params.push(id);

  try {
    //generated query as `UPDATE posts SET title = ?, message = ? WHERE id = ?`;
    db.run(sql, params, (err) => {
      if (err) {
        return res.json({
          status: 300,
          success: false,
          error: err,
        });
      }
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
};

const deletePost = async (req, res) => {
  const { id } = req.body;
  sql = `DELETE FROM posts WHERE id = ?`;

  try {
    db.run(sql, [id], (err) => {
      if (err) {
        return res.json({
          status: 300,
          success: false,
          error: err,
        });
      }

      res.json({
        status: 200,
        success: true,
      });
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
};

module.exports = {
  getFilteredPosts,
  createPost,
  updatePost,
  deletePost,
};
