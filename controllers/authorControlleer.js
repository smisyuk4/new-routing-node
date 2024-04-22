const jwt = require('jsonwebtoken');
require('dotenv').config();
const { generateAccessToken } = require('../helpers/generateAccessToken');
const {
  addAuthor,
  addToken,
  removeToken,
  updateFieldsAuthor,
  getAuthorByToken,
  getAuthorByEmail,
  getAllAuthors,
  removeAuthor,
} = require('../services/authorServices');
const { constants } = require('../constants');

const registerAuthor = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'name and email required',
    });
  }

  try {
    const resultCheck = await getAuthorByEmail(email);

    if (resultCheck?.email) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

    const author = { name, email };
    const accessToken = generateAccessToken(author);
    const refreshToken = jwt.sign(author, process.env.REFRESH_TOKEN_SECRET);

    const result = await addAuthor(name, email, refreshToken);

    if (result?.status) {
      return res.status(200).json({ accessToken, refreshToken });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const loginAuthor = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'name and email required',
    });
  }

  const author = { name, email };
  const accessToken = generateAccessToken(author);
  const refreshToken = jwt.sign(author, process.env.REFRESH_TOKEN_SECRET);

  try {
    const result = await addToken(refreshToken, email);

    if (result?.status) {
      return res.status(200).json({ accessToken, refreshToken });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const checkAndGenerateToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const { name, email } = await getAuthorByToken(refreshToken);

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
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Author not found' });
  }

  try {
    const { email } = await getAuthorByToken(refreshToken);

    if (!email) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const result = await removeToken(email);

    if (result?.message === constants.LOGOUT_SUCCESS) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updateAuthorProfile = async (req, res) => {
  const { author_id, name, location, avatar_url } = req.body;

  if (!author_id) {
    return res.status(400).json({
      success: false,
      message: 'author_id required',
    });
  }

  try {
    const result = await updateFieldsAuthor(
      author_id,
      name,
      location,
      avatar_url
    );

    if (result?.status) {
      console.log(result);
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAuthors = async (req, res) => {
  try {
    const result = await getAllAuthors();

    if (result.length > 0) {
      return res.status(200).json({ authors: result });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
    });
  }
};

const deleteAuthor = async (req, res) => {
  const { author_id, refreshToken } = req.body;

  if (!author_id || !refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'author_id and refreshToken required',
    });
  }

  try {
    const result = await removeAuthor(author_id, refreshToken);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
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
