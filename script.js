// create ./800 versions of ./o

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Path to the source folder and the target folder
const sourceFolder = path.join(__dirname, 'o');
const targetFolder = path.join(__dirname, '800');

// Ensure the target folder exists
if (!fs.existsSync(targetFolder)) {
  fs.mkdirSync(targetFolder);
}

// Read all files in the source folder
fs.readdir(sourceFolder, (err, files) => {
  if (err) {
    console.error('Error reading source folder:', err);
    return;
  }

  files.forEach((file) => {
    const sourceFilePath = path.join(sourceFolder, file);
    const targetFilePath = path.join(targetFolder, file);

    // Check if the file already exists in the target folder
    if (!fs.existsSync(targetFilePath)) {
      // Resize the image to 800px wide using Sharp
      sharp(sourceFilePath)
        .resize(800)
        .toFile(targetFilePath, (err, info) => {
          if (err) {
            console.error(`Error processing file ${file}:`, err);
          } else {
            console.log(`Resized ${file} and saved to ${targetFilePath}`);
          }
        });
    } else {
      console.log(`File ${file} already exists in ${targetFolder}, skipping.`);
    }
  });
});
