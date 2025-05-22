const fs = require('fs').promises;
const path = require('path');
const { ValidationError } = require('../errors');

/**
 * Upload a file to the storage system
 * @param {Object} file - Multer file object
 * @param {string} folder - Target folder name
 * @returns {Promise<Object>} Upload result with URL and metadata
 */
const uploadToStorage = async (file, folder) => {
  try {
    // Create folder if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    const filepath = path.join(uploadDir, filename);

    // Move file to destination
    await fs.rename(file.path, filepath);

    // Generate URL
    const url = `/uploads/${folder}/${filename}`;

    return {
      url,
      metadata: {
        filename,
        path: filepath
      }
    };
  } catch (error) {
    throw new ValidationError(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Delete a file from storage
 * @param {string} url - File URL to delete
 * @returns {Promise<void>}
 */
const deleteFromStorage = async (url) => {
  try {
    // Convert URL to filesystem path
    const filepath = path.join(process.cwd(), url);
    
    // Check if file exists
    try {
      await fs.access(filepath);
    } catch {
      return; // File doesn't exist, nothing to delete
    }

    // Delete file
    await fs.unlink(filepath);
  } catch (error) {
    throw new ValidationError(`Failed to delete file: ${error.message}`);
  }
};

module.exports = {
  uploadToStorage,
  deleteFromStorage
}; 