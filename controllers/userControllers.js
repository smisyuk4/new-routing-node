const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');
//const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
//const sharp = require('sharp');
require('dotenv').config();
const { generateAccessToken } = require('../helpers/generateAccessToken');
const {
  s3SendFile,
  s3GeneratorUrl,
  s3CreateOneUrl,
} = require('../middleware/s3CloudStorage');
const {
  addUser,
  addToken,
  removeToken,
  updateFieldsUser,
  updateUserPassword,
  getUserByToken,
  getUserByEmail,
  getAllUsers,
  removeUser,
  getRoles,
  addPlan,
  getPlans,
  updateFieldsPlan,
  removePlan,
} = require('../services/userServices');
const { constants } = require('../constants');

//const bucketName = process.env.BUCKET_NAME;
//const s3 = new S3Client({
//  credentials: {
//    accessKeyId: process.env.ACCESS_KEY,
//    secretAccessKey: process.env.SECRET_ACCESS_KEY,
//  },
//  region: process.env.BUCKET_REGION,
//});

const register = async (req, res) => {
  const { password, email, role } = req.body;

  if (!password || !email || !role) {
    return res.status(400).json({
      message: 'password, email and role required',
    });
  }

  try {
    const userInBase = await getUserByEmail(email);

    if (userInBase?.email) {
      return res.status(400).json({
        message: 'email is wrong',
      });
    }

    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    const user = { password: hashPassword, email };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    const result = await addUser(hashPassword, email, role, refreshToken);

    if (result?.status) {
      return res.status(200).json({ accessToken, refreshToken });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const login = async (req, res) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return res.status(400).json({
      message: 'password and email required',
    });
  }

  try {
    const userInBase = await getUserByEmail(email);

    if (userInBase.message === constants.NO_MATCH_USERS) {
      return res.status(400).json({
        message: 'email is wrong',
      });
    }

    const isMatch = await bcrypt.compare(password, userInBase.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'password is wrong',
      });
    }

    const user = { password: userInBase.password, email };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

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
    const { password, email } = await getUserByToken(refreshToken);

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
      password,
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
  const { user_id } = req.user;
  const { sign_plan, payment, location } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  const checkFields = [sign_plan, payment, location].find(
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

const changeUserPassword = async (req, res) => {
  const { user_id, password: oldHashPassword } = req.user;
  const { password_old, password_new } = req.body;

  try {
    const isMatch = await bcrypt.compare(password_old, oldHashPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: 'password_old is wrong',
      });
    }

    const newHashedPassword = await bcrypt.hash(
      password_new,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    const result = await updateUserPassword(user_id, newHashedPassword);

    if (result?.status) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const changeUserAvatar = async (req, res) => {
  const user_id = 3;
  const pathFile = `Avatars/500x500_${user_id}`;
  //const { user_id } = req.user;

  try {
    const resultSendFile = await s3SendFile(req.file, pathFile);

    if (!resultSendFile?.['$metadata']) {
      return res.status(400).json({ error: resultSendFile });
    }

    const resultSendData = await updateFieldsUser({
      user_id,
      avatar_url: pathFile,
    });

    if (resultSendData?.status) {
      const newUrl = await s3CreateOneUrl(pathFile);

      return res
        .status(200)
        .json({ ...resultSendData.data, avatar_url: newUrl });
    }

    res.status(400).json(resultSendData);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await getAllUsers();

    if (result?.length > 0) {
      const updatedArray = await s3GeneratorUrl(result);

      return res.status(200).json(updatedArray);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteUser = async (req, res) => {
  const { user_id } = req.user;

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

const getUserRoles = async (req, res) => {
  try {
    const result = await getRoles();

    if (result?.length > 0) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const createPlan = async (req, res) => {
  const { user_id } = req.user;
  const { title, cost } = req.body;

  if (!user_id || !title || !cost) {
    return res.status(400).json({
      message: 'user_id, title and cost required',
    });
  }

  try {
    const result = await addPlan(title, cost);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAllPlans = async (req, res) => {
  try {
    const result = await getPlans();

    if (result?.length > 0) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updatePlan = async (req, res) => {
  const { user_id } = req.user;
  const { plan_id, title, cost } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  const checkFields = [title, cost].find((item) => item !== undefined);

  if (!checkFields) {
    return res.status(400).json({
      message: 'Need minimum one field for change',
    });
  }

  try {
    const result = await updateFieldsPlan(plan_id, title, cost);

    if (result?.status) {
      return res.status(200).json(result.data);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deletePlan = async (req, res) => {
  const { user_id } = req.user;
  const { plan_id } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  if (!plan_id) {
    return res.status(400).json({
      message: 'plan_id is required',
    });
  }

  try {
    const result = await removePlan(plan_id);

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
  changeUserPassword,
  changeUserAvatar,
  getUsers,
  deleteUser,
  getUserRoles,
  createPlan,
  getAllPlans,
  updatePlan,
  deletePlan,
};
