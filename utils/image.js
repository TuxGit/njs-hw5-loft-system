const fs = require('fs');
const gm = require('gm');
// const path = require('path');
// const config = require('../etc/config.json');

// resizeImage ByPath -> todo: streams
function resizeImage (input, output, options) {
  const { max_width: maxWidth, max_height: maxHeight, quality } = options;

  return new Promise(function (resolve, reject) {
    // resize, compress and remove EXIF profile data
    gm(input)
      .noProfile()
      .resize(maxWidth, maxHeight)
      // .sharpen(1)
      .quality(quality || 75)
      .write(output, function (err) {
        if (err) {
          reject(err);
          return;
        }
        fs.unlinkSync(input); // todo: async
        resolve();
      });
  });
}

module.exports.resizeImage = resizeImage;
