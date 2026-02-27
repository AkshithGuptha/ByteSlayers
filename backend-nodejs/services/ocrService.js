const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const path = require("path");

async function preprocessImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  
  // Only preprocess image files, not PDFs
  if (ext === '.pdf') {
    return imagePath;
  }
  
  const processed = imagePath.replace(path.extname(imagePath), "-processed.png");
  
  try {
    await sharp(imagePath)
      .grayscale()
      .normalize()
      .sharpen()
      .toFile(processed);
    return processed;
  } catch (error) {
    console.error("Preprocessing failed, using original:", error);
    return imagePath;
  }
}

async function extractText(imagePath) {
  try {
    const processedPath = await preprocessImage(imagePath);

    const { data } = await Tesseract.recognize(
      processedPath,
      "eng",
      {
        logger: m => console.log(m)
      }
    );

    return data.text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Failed to extract text from image");
  }
}

module.exports = extractText;
