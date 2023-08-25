const fs = require('fs');
const sharp = require("sharp");
const sizes = [200, 400, 800]

resizeAllImages()

async function resizeAllImages() {
  fs.readdir('../o', (err, files) => {
    files.forEach(file => {
      console.log(file);
      sizes.forEach(size => {
        resizeImage(file, size)
      })
    });
  });
}

async function resizeImage(file, size) {
  try {
      await sharp(`../o/${file}`)
          .resize({
              height: size
          })
          .jpeg({
              quality: 80,
              mozjpeg: true
          })
          .toFile(`../${size}/${file}`);
  } catch (error) {
      console.log(error);
  }
}

module.exports = { resizeAllImages }