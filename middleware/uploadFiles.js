const multer = require('multer');
const { constants } = require('../constants');

const MAX_FILE_SIZE = 3;

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/webp'
    ) {
      return cb(constants.IMAGE_TYPE, false);
    }
    cb(null, true);
  },
});

const multerErrorHandling = (err, req, res, next) => {
  if (err === constants.IMAGE_TYPE) {
    return res.status(400).send('Multer error: ' + constants.IMAGE_TYPE);
  }

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
