const url = require('url');
const {
  addComment,
  updateComment,
  getCommentsByQuery,
  removeComment,
} = require('../services/commentServices');
const { constants } = require('../constants');

const createComment = async (req, res) => {
  const { user_id } = req.user;
  const { post_id, message } = req.body;

  if (!user_id || !post_id || !message) {
    return res.status(400).json({
      message: 'user_id, post_id and message required',
    });
  }

  try {
    const result = await addComment(user_id, post_id, message);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updateMyComment = async (req, res) => {
  const { user_id } = req.user;
  const { post_id, comment_id, message } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  if (!post_id || !comment_id || !message) {
    return res.status(400).json({
      message: 'post_id, comment_id, message required',
    });
  }

  try {
    const result = await updateComment(user_id, post_id, comment_id, message);

    if (result?.status) {
      return res.status(200).json(result.data);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getCommentsBelowPost = async (req, res) => {
  const { field, value } = url.parse(req.url, true).query;

  if (!field && !value) {
    return res.status(400).json({
      message: 'field and value required',
    });
  }

  try {
    const result = await getCommentsByQuery({
      field,
      value,
    });
    if (result?.length > 0) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getAllComments = async (req, res) => {
  const { role } = req.user;
  const { field, value } = url.parse(req.url, true).query;

  if (role !== constants.ADMIN) {
    return res.status(400).json({
      message: 'this query filter available only for user with role admin',
    });
  }

  let params = {};
  if (role === constants.ADMIN) {
    params = {
      field,
      value,
    };
  }

  try {
    const result = await getCommentsByQuery(params);
    if (result?.length > 0) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteComment = async (req, res) => {
  const { user_id } = req.user;
  const { comment_id } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  if (!comment_id) {
    return res.status(400).json({
      message: 'comment_id is required',
    });
  }

  try {
    const result = await removeComment(comment_id, user_id);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  createComment,
  updateMyComment,
  getCommentsBelowPost,
  getAllComments,
  deleteComment,
};
