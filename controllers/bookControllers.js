const { addBook, getAllBooks } = require('../services/bookServices');

const createBook = async (req, res) => {
  const {
    author_id,
    title,
    description,
    cover_image_url,
    literary_genre,
    cost,
    count,
  } = req.body;

  const params = [
    author_id,
    title,
    description,
    cover_image_url,
    literary_genre,
    cost,
    count,
  ];

  if (!author_id || !title || !description) {
    return res.status(400).json({
      message: 'author_id, title and description required',
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

const getBooks = async (req, res) => {
  try {
    const result = await getAllBooks();
    if (result?.length > 0) {
      return res.status(200).json({ books: result });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  createBook,
  getBooks,
};
