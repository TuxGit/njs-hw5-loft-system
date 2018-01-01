// for upload files
const path = require('path');
const crypto = require('crypto');
const multer = require('koa-multer');

// const upload = multer({ dest: 'public/uploads/' }); - simple usage
const uploadMulterMiddleware = multer({
  storage: multer.diskStorage({
    destination: 'public/uploads/',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err);
        cb(null, raw.toString('hex') + path.extname(file.originalname));
      });
    }
  })
});

module.exports.uploadMulterMiddleware = uploadMulterMiddleware;
