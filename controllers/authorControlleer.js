const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { generateAccessToken } = require('../helpers/generateAccessToken');
const { getAuthorToken } = require('../services/authorServices');

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
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET); // save to SQLite

  const dateISO = new Date().toISOString();
  sql = `UPDATE authors SET token = ?, date_update = ? WHERE email = ?`;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'name and email required',
    });
  }

  try {
    db.run(sql, [refreshToken, dateISO, email], function (err) {
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
        accessToken,
        refreshToken,
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

const checkAndGenerateToken = async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const { name, email } = await getAuthorToken(refreshToken);

    if (!email) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let decodedToken = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const accessToken = generateAccessToken({
      name,
      email,
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(401).json(error);
  }
};

const logOutAuthor = async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const { email } = await getAuthorToken(refreshToken);

    if (!email) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const dateISO = new Date().toISOString();
    sql = `UPDATE authors SET token = ?, date_update = ? WHERE email = ?`;

    db.run(sql, [null, dateISO, email], function (err) {
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

      return res.status(204);
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

const updateAuthorProfile = async (req, res) => {};

const getAuthors = async (req, res) => {
  sql = `SELECT * FROM authors`;

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
  checkAndGenerateToken,
  logOutAuthor,
  updateAuthorProfile,
  getAuthors,
  deleteAuthor,
};
