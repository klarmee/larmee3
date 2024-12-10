//compress ./hi below 1.5mb

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Path to the folder containing the images
const folderPath = path.join(__dirname, 'hi');
const maxSize = 1.5 * 1024 * 1024; // 1.5 MB in bytes

// Read all files in the folder
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading the folder:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    
    // Skip non-image files or directories
    if (!fs.lstatSync(filePath).isFile()) return;

    // Check the initial file size
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Error getting stats for file ${file}:`, err);
        return;
      }

      const initialSize = stats.size;

      // If the file is already below the threshold, skip
      if (initialSize < maxSize) {
        console.log(`${file} is already below 1.5MB, skipping.`);
        return;
      }

      console.log(`Compressing ${file}, initial size: ${(initialSize / (1024 * 1024)).toFixed(2)} MB`);

      // Apply compression to reduce file size
      compressFile(filePath);
    });
  });
});

// Function to apply compression until the file size is under the target
async function compressFile(filePath) {
  const extname = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath);
  const tempPath = path.join(__dirname, 'hi', 'temp', fileName); // Temporary path to save intermediate compressed files

  // Ensure the temp folder exists
  if (!fs.existsSync(path.dirname(tempPath))) {
    fs.mkdirSync(path.dirname(tempPath), { recursive: true });
  }

  let quality = 90; // Start with a high quality, then reduce
  let compressed = false;
  let buffer;

  while (!compressed) {
    try {
      if (extname === '.jpg' || extname === '.jpeg') {
        buffer = await sharp(filePath)
          .jpeg({ quality })
          .toBuffer();
      } else if (extname === '.png') {
        buffer = await sharp(filePath)
          .png({ quality: Math.max(quality, 30) }) // png doesn't use quality exactly like jpg
          .toBuffer();
      } else {
        console.log(`${fileName} has unsupported file format. Skipping.`);
        return;
      }

      // Check the compressed file size
      const compressedSize = buffer.length;
      console.log(`Compressed size of ${fileName}: ${(compressedSize / (1024 * 1024)).toFixed(2)} MB`);

      if (compressedSize < maxSize) {
        // Save the compressed file if it's below the target size
        fs.writeFileSync(filePath, buffer);
        console.log(`${fileName} compressed successfully to under 1.5MB.`);
        compressed = true; // Stop the loop if the size is below the threshold
      } else {
        // If it's still too large, reduce quality further
        quality -= 10; // Decrease quality by 10%
        if (quality <= 10) {
          console.log(`${fileName} could not be compressed to under 1.5MB, even at 10% quality.`);
          fs.writeFileSync(filePath, buffer); // Save the file at the last compressed quality
          compressed = true;
        }
      }
    } catch (err) {
      console.error(`Error compressing file ${filePath}:`, err);
      break; // Exit the loop if an error occurs
    }
  }
}
