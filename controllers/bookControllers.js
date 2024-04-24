const url = require('url');
const {
  addBook,
  updateFieldsBook,
  getBooksByQuery,
  removeBook,
} = require('../services/bookServices');

const createBook = async (req, res) => {
  const { user_id } = req.user;
  const { title, short_desc, cover_image_url, literary_genre, cost, count } =
    req.body;

  const params = [
    user_id,
    title,
    short_desc,
    cover_image_url,
    literary_genre,
    cost,
    count,
  ];

  if (!user_id || !title || !short_desc) {
    return res.status(400).json({
      message: 'user_id, title and short_desc required',
    });
  }

  try {
    const result = await addBook(params);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const updateBook = async (req, res) => {
  const { user_id } = req.user;
  const {
    book_id,
    title,
    short_desc,
    cover_image_url,
    literary_genre,
    cost,
    count,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  if (!book_id) {
    return res.status(400).json({
      message: 'book_id is required',
    });
  }

  const checkFields = [
    title,
    short_desc,
    cover_image_url,
    literary_genre,
    cost,
    count,
  ].find((item) => item !== undefined);

  if (!checkFields) {
    return res.status(400).json({
      message: 'Need minimum one field for change',
    });
  }

  try {
    const result = await updateFieldsBook(
      user_id,
      book_id,
      title,
      short_desc,
      cover_image_url,
      literary_genre,
      cost,
      count
    );

    if (result?.status) {
      return res.status(200).json(result.data);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getFilteredBooks = async (req, res) => {
  const { field, value } = url.parse(req.url, true).query;

  try {
    const result = await getBooksByQuery(field, value);

    if (result?.length > 0) {
      return res.status(200).json({ books: result });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteBook = async (req, res) => {
  const { user_id } = req.user;
  const { book_id } = req.body;

  if (!user_id) {
    return res.status(400).json({
      message: 'user_id is required',
    });
  }

  if (!book_id) {
    return res.status(400).json({
      message: 'book_id is required',
    });
  }

  try {
    const result = await removeBook(book_id, user_id);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  createBook,
  updateBook,
  getFilteredBooks,
  deleteBook,
};
