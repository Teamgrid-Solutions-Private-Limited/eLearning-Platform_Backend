const fs = require('fs').promises;
const path = require('path');

const requiredDirectories = [
  'uploads',
  'uploads/temp',
  'public',
  'public/scorm-content'
];

async function initializeDirectories() {
  for (const dir of requiredDirectories) {
    const dirPath = path.join(process.cwd(), dir);
    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    } catch (error) {
      console.error(`Error creating directory ${dirPath}:`, error);
    }
  }
}

module.exports = { initializeDirectories }; 