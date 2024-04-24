const jwt = require('jsonwebtoken');
require('dotenv').config();

const { getAuthorByEmail } = require('../services/userServices');
const { constants } = require('../constants');

const authenticationToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'AccessToken in headers not found' });
  }

  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return res.status(403).json(error);
  }

  if (!decodedToken) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const currentAuthor = await getAuthorByEmail(decodedToken.email);
    req.author = currentAuthor;
    next();
  } catch (error) {
    if (error.message === constants.NO_MATCH_USERS) {
      return res.status(403).json(error);
    }
  }
};

module.exports = {
  authenticationToken,
};
