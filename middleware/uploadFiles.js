const multer = require('multer');

const MAX_FILE_SIZE = 3;

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE * 1024 * 1024,
  },
});

const multerErrorHandling = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .send('Multer error: ' + `${err.code} = ${MAX_FILE_SIZE} mb`);
    }

    res.status(400).send('Multer error: ' + err.code);
  } else {
    next();
  }
};

module.exports = {
  multerMid,
  multerErrorHandling,
};
