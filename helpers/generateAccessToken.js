const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.TIME_LIFE_TOKEN,
  });
};

module.exports = {
  generateAccessToken,
};
