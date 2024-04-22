const url = require('url');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

const registerAuthor = async (req, res) => {
  const { name, email } = req.body;
  const dateISO = new Date().toISOString();
  sql = `INSERT INTO authors(name, email, token, date_publish, date_update) VALUES(?,?,?,?,?)`;
  const token = 'test_register_token_000000000';

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'name and email required',
    });
  }

  try {
    db.run(sql, [name, email, token, dateISO, dateISO], (err) => {
      if (err) {
        return res.status(300).json({
          success: false,
          error: err,
        });
      }
      res.status(200).json({
        success: true,
        token,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

const loginAuthor = async (req, res) => {
  const { name, email } = req.body;

  const user = { name, email };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({
    success: true,
    accessToken,
  });
  //const dateISO = new Date().toISOString();
  //sql = `UPDATE authors SET token = ?, date_update = ? WHERE email = ?`;
  //const token = 'test_login_token_000000000';

  //if (!name || !email) {
  //  return res.status(400).json({
  //    success: false,
  //    message: 'name and email required',
  //  });
  //}

  //try {
  //  db.run(sql, [token, dateISO, email], function (err) {
  //    if (err) {
  //      return res.status(300).json({
  //        success: false,
  //        error: err,
  //      });
  //    }

  //    if (this.changes === 0) {
  //      return res.status(300).json({
  //        success: false,
  //        message: `Author with ${email} not found.`,
  //      });
  //    }

  //    res.status(200).json({
  //      success: true,
  //      token,
  //    });
  //  });
  //} catch (error) {
  //  return res.status(400).json({
  //    success: false,
  //  });
  //}
};

const logOutAuthor = async (req, res) => {
  const { name, email } = req.body;
  const dateISO = new Date().toISOString();
  sql = `UPDATE authors SET token = ?, date_update = ? WHERE email = ?`;
  const token = null;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'name and email required',
    });
  }

  try {
    db.run(sql, [token, dateISO, email], function (err) {
      if (err) {
        return res.status(300).json({
          success: false,
          error: err,
        });
      }

      if (this.changes === 0) {
        return res.status(300).json({
          success: false,
          message: `Author with ${email} not found.`,
        });
      }

      res.status(200).json({
        success: true,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

const updateAuthorProfile = async (req, res) => {};

const getAuthors = async (req, res) => {
  sql = `SELECT * FROM authors`; // get all data

  //const queryObject = url.parse(req.url, true).query;

  //if (queryObject.field && queryObject.value) {
  //  // get filtered data
  //  sql += ` WHERE ${queryObject.field} LIKE '%${queryObject.value}%'`;
  //}

  try {
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(300).json({
          success: false,
          error: err,
        });
      }

      if (rows.length < 1) {
        return res.status(300).json({
          success: false,
          error: 'No match',
        });
      }

      return res.status(200).json({
        success: true,
        data: rows,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

const deleteAuthor = async (req, res) => {
  const { author_id, token } = req.body;
  sql = `DELETE FROM authors WHERE author_id = ? AND token = ?`;

  if (!author_id || !token) {
    return res.status(400).json({
      success: false,
      message: 'author_id and token required',
    });
  }

  try {
    db.run(sql, [author_id, token], function (err) {
      if (err) {
        return res.status(300).json({
          success: false,
          error: err,
        });
      }

      if (this.changes === 0) {
        return res.status(300).json({
          success: false,
          message: `Author not found or token not correct.`,
        });
      }

      res.status(200).json({
        success: true,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

module.exports = {
  registerAuthor,
  loginAuthor,
  logOutAuthor,
  updateAuthorProfile,
  getAuthors,
  deleteAuthor,
};
