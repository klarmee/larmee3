const sharp = require("sharp");

async function getMetadata() {
  try {
    const metadata = await sharp("stations.jpg").metadata();
    console.log(metadata);
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

getMetadata();