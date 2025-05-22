const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ensureDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
};

const generateUniqueFileName = (originalName) => {
  const extension = path.extname(originalName);
  return `${uuidv4()}${extension}`;
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
};

const moveFile = async (sourcePath, destinationPath) => {
  try {
    await ensureDirectoryExists(path.dirname(destinationPath));
    await fs.rename(sourcePath, destinationPath);
  } catch (error) {
    throw new Error(`Error moving file: ${error.message}`);
  }
};

module.exports = {
  ensureDirectoryExists,
  generateUniqueFileName,
  deleteFile,
  moveFile
}; 