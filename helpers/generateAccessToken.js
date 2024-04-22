const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '50s' });
};

module.exports = {
  generateAccessToken,
};
