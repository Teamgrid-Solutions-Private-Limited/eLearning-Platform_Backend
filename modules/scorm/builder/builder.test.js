const fs = require('fs');
const path = require('path');
const ScormBuilder = require('./builder');
const { SCORM_VERSIONS } = require('../../../shared/constants/scorm');

describe('ScormBuilder', () => {
  let builder;
  const testMetadata = {
    title: 'Test Course',
    description: 'Test Description'
  };

  const testContent = {
    files: [
      {
        path: 'index.html',
        content: '<html><body>Test Content</body></html>'
      }
    ]
  };

  beforeEach(() => {
    builder = new ScormBuilder(SCORM_VERSIONS.SCORM_1_2);
  });

  afterEach(async () => {
    // Clean up any created files
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        if (file.endsWith('.zip')) {
          fs.unlinkSync(path.join(uploadsDir, file));
        }
      }
    }
  });

  test('should create a SCORM package successfully', async () => {
    const packagePath = await builder.createPackage(testContent, testMetadata);
    
    // Check if package file exists
    expect(fs.existsSync(packagePath)).toBe(true);
    
    // Check if it's a valid zip file
    const stats = fs.statSync(packagePath);
    expect(stats.size).toBeGreaterThan(0);
  });

  test('should generate valid manifest XML', async () => {
    const manifestContent = builder.getManifestTemplate(testMetadata);
    
    // Check if manifest contains required elements
    expect(manifestContent).toContain('<?xml version="1.0"');
    expect(manifestContent).toContain(testMetadata.title);
    expect(manifestContent).toContain('schema>ADL SCORM</schema>');
    expect(manifestContent).toContain('schemaversion>1.2</schemaversion>');
  });

  test('should create package with correct structure', async () => {
    const packagePath = await builder.createPackage(testContent, testMetadata);
    
    // Check if package file exists and has content
    expect(fs.existsSync(packagePath)).toBe(true);
    const stats = fs.statSync(packagePath);
    expect(stats.size).toBeGreaterThan(0);
    
    // Check if the package name follows the expected pattern
    expect(packagePath).toMatch(new RegExp(`${testMetadata.title}-\\d+\\.zip`));
  });

  test('should handle errors gracefully', async () => {
    const invalidContent = {
      files: [
        {
          path: 'nonexistent.html',
          content: 'invalid'
        }
      ]
    };

    await expect(builder.createPackage(invalidContent, testMetadata))
      .rejects
      .toThrow();
  });
}); 