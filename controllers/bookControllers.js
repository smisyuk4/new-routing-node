const url = require('url');
const {
  addBook,
  updateFieldsBook,
  getBooksByQuery,
  removeBook,
  addGenre,
  getGenresByQuery,
} = require('../services/bookServices');
const { s3SendFile, s3CreateOneUrl } = require('../middleware/s3CloudStorage');

const createBook = async (req, res) => {
  const { user_id } = req.user;
  const { title, short_desc, cover_image_url, literary_genre, cost, count } =
    req.body;

  const params = [
    user_id,
    title,
    short_desc,
    cover_image_url,
    literary_genre?.join(' | '),
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
    literary_genre?.join(' | '),
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
      literary_genre?.join(' | '),
      cost,
      count
    );

    if (result?.status) {
      const updatedBook = {
        ...result.data,
        literary_genre: result.data.literary_genre?.split(' | ') || null,
      };

      return res.status(200).json(updatedBook);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

//
const changeBookCover = async (req, res) => {
  const { user_id } = req.user;
  const { book_id } = req.body;

  if (!book_id) {
    return res.status(400).json({
      message: 'book_id is required',
    });
  }

  const pathFile = `Books/800x500_${user_id}_${book_id}`;

  try {
    await s3SendFile(req.file, pathFile);

    const resultSendData = await updateFieldsBook({
      user_id,
      book_id,
      cover_image_url: pathFile,
    });

    if (resultSendData?.status) {
      const newUrl = await s3CreateOneUrl(pathFile);

      return res
        .status(200)
        .json({ ...resultSendData.data, cover_image_url: newUrl });
    }

    res.status(400).json(resultSendData);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteUserAvatar = async (req, res) => {
  const { user_id } = req.user;
  const pathFile = `Avatars/500x500_${user_id}`;

  try {
    const result = await updateFieldsUser({
      user_id,
      avatar_url: constants.EMPTY,
    });

    if (
      result?.status &&
      (result?.data?.avatar_url || result?.data?.avatar_url !== constants.EMPTY)
    ) {
      await s3RemoveFile(pathFile);

      return res.sendStatus(204);
    }

    return res.status(400).json({ message: constants.NO_REMOVED });
  } catch (error) {
    return res.status(400).json(error);
  }
};

//

const getFilteredBooks = async (req, res) => {
  const { field, value, pageNumber, pageSize } = url.parse(req.url, true).query;

  try {
    const result = await getBooksByQuery(field, value, pageNumber, pageSize);

    if (result?.length > 0) {
      const updatedBooks = result.map((book) => {
        return {
          ...book,
          literary_genre: book.literary_genre?.split(' | ') || null,
        };
      });

      return res.status(200).json(updatedBooks);
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

const createGenre = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      message: 'title is required',
    });
  }

  try {
    const result = await addGenre(title);

    if (result?.status) {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

const getFilteredGenres = async (req, res) => {
  const { field, value } = url.parse(req.url, true).query;

  try {
    const result = await getGenresByQuery(field, value);

    if (result?.length > 0) {
      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  createBook,
  updateBook,
  changeBookCover,
  getFilteredBooks,
  deleteBook,
  createGenre,
  getFilteredGenres,
};
