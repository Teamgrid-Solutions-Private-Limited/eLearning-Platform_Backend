const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FileUtils {
  async moveFile(sourcePath, destinationPath) {
    try {
      // Create destination directory if it doesn't exist
      const destDir = path.dirname(destinationPath);
      await fs.mkdir(destDir, { recursive: true });

      // Move the file
      await fs.rename(sourcePath, destinationPath);
      return destinationPath;
    } catch (error) {
      console.error('Error moving file:', error);
      throw error;
    }
  }

  async deleteFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
      throw error;
    }
  }

  generateUniqueFileName(originalName) {
    const extension = path.extname(originalName);
    return `${uuidv4()}${extension}`;
  }
}

module.exports = {
  fileUtils: new FileUtils()
}; 