const jwt = require('jsonwebtoken');
require('dotenv').config();
const { generateAccessToken } = require('../helpers/generateAccessToken');
const {
  addUser,
  addToken,
  removeToken,
  updateFieldsUser,
  getUserByToken,
  getUserByEmail,
  getAllUsers,
  removeUser,
} = require('../services/userServices');
const { constants } = require('../constants');

const register = async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({
      message: 'name, email and role required',
    });
  }

  try {
    const resultCheck = await getUserByEmail(email);

    if (resultCheck?.email) {
      return res.status(409).json({
        message: 'Email already exists',
      });
    }

    const user = { name, email };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    const result = await addUser(name, email, role, refreshToken);

    if (result?.status) {
      return res.status(200).json({ accessToken, refreshToken });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const login = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: 'name and email required',
    });
  }

  const user = { name, email };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

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
    const { name, email } = await getUserByToken(refreshToken);

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

const logOut = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'refreshToken is required' });
  }

  try {
    const { email } = await getUserByToken(refreshToken);

    if (!email) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const result = await removeToken(email);

    if (result?.message === constants.LOGOUT_SUCCESS) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updateUserProfile = async (req, res) => {
  const { user_id, name, sign_plan, payment, location } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  const checkFields = [name, sign_plan, payment, location].find(
    (item) => item !== undefined
  );

  if (!checkFields) {
    return res.status(400).json({
      message: 'Need minimum one field for change',
    });
  }

  try {
    const result = await updateFieldsUser(
      user_id,
      name,
      sign_plan,
      payment,
      location
    );

    if (result?.status) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await getAllUsers();

    if (result?.length > 0) {
      return res.status(200).json({ users: result });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteUser = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  try {
    const result = await removeUser(user_id);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  register,
  login,
  checkAndGenerateToken,
  logOut,
  updateUserProfile,
  getUsers,
  deleteUser,
};
