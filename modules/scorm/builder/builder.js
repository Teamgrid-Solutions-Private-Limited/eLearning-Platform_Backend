const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { SCORM_VERSIONS } = require('../../../shared/constants/scorm');

class ScormBuilder {
  constructor(version = SCORM_VERSIONS.SCORM_1_2) {
    this.version = version;
    this.tempDir = path.join(process.cwd(), 'uploads', 'temp', uuidv4());
    this.manifestPath = path.join(this.tempDir, 'imsmanifest.xml');
  }

  async createPackage(content, metadata) {
    try {
      // Create temp directory
      await fs.promises.mkdir(this.tempDir, { recursive: true });

      // Generate manifest
      await this.generateManifest(metadata);

      // Copy content files
      await this.copyContentFiles(content);

      // Create ZIP package
      const packagePath = await this.createZipPackage(metadata.title);

      // Cleanup
      await this.cleanup();

      return packagePath;
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  async generateManifest(metadata) {
    const manifestTemplate = this.getManifestTemplate(metadata);
    await fs.promises.writeFile(this.manifestPath, manifestTemplate);
  }

  async copyContentFiles(content) {
    // Implementation for copying content files
    // This would handle copying HTML, images, and other assets
  }

  async createZipPackage(title) {
    const outputPath = path.join(process.cwd(), 'uploads', `${title}-${Date.now()}.zip`);
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => resolve(outputPath));
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(this.tempDir, false);
      archive.finalize();
    });
  }

  async cleanup() {
    try {
      await fs.promises.rm(this.tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error cleaning up temp directory:', error);
    }
  }

  getManifestTemplate(metadata) {
    // Implementation would return the appropriate SCORM manifest XML
    // Different for SCORM 1.2 and SCORM 2004
    return `<?xml version="1.0" encoding="UTF-8"?>
      <manifest identifier="com.example.course" version="1.2"
        xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
        xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
        http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
        http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
        <metadata>
          <schema>ADL SCORM</schema>
          <schemaversion>1.2</schemaversion>
        </metadata>
        <organizations default="TOC1">
          <organization identifier="TOC1">
            <title>${metadata.title}</title>
            <item identifier="ITEM1" identifierref="RESOURCE1">
              <title>${metadata.title}</title>
            </item>
          </organization>
        </organizations>
        <resources>
          <resource identifier="RESOURCE1" type="webcontent" adlcp:scormtype="sco" href="index.html">
            <file href="index.html"/>
          </resource>
        </resources>
      </manifest>`;
  }
}

module.exports = ScormBuilder; 