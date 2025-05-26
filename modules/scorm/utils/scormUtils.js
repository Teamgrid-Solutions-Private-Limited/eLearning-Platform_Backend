const fs = require("fs-extra");
const path = require("path");
const archiver = require("archiver");

const buildManifest = (template, course) => {
  const items = course.slides.map((slide, i) => `
    <item identifier="ITEM${i + 1}" identifierref="RES${i + 1}">
      <title>${slide.title}</title>
    </item>`).join("");

  const resources = course.slides.map((slide, i) => `
    <resource identifier="RES${i + 1}" type="webcontent" adlcp:scormtype="sco" href="slide${i + 1}.html">
      <file href="slide${i + 1}.html"/>
    </resource>`).join("");

  return template
    .replace("{{courseTitle}}", course.title)
    .replace("{{items}}", items)
    .replace("{{resources}}", resources);
};

const buildSlideHtml = (template, slide) =>
  template.replace(/{{title}}/g, slide.title).replace(/{{body}}/g, slide.body);

const createScormPackage = async (course) => {
  const exportDir = path.join(__dirname, "..", "scorm_exports", `${course._id}`);
  await fs.emptyDir(exportDir);

  const manifestTemplate = await fs.readFile(path.join(__dirname, "..", "templates", "imsmanifest.template.xml"), "utf8");
  const slideTemplate = await fs.readFile(path.join(__dirname, "..", "templates", "index.template.html"), "utf8");

  // Create slide files
  for (let i = 0; i < course.slides.length; i++) {
    const slideHtml = buildSlideHtml(slideTemplate, course.slides[i]);
    await fs.writeFile(path.join(exportDir, `slide${i + 1}.html`), slideHtml);
  }

  // Create manifest
  const manifestContent = buildManifest(manifestTemplate, course);
  await fs.writeFile(path.join(exportDir, "imsmanifest.xml"), manifestContent);

  // Zip
  const zipPath = path.join(__dirname, "..", "scorm_exports", `${course._id}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip");

  archive.pipe(output);
  archive.directory(exportDir, false);
  await archive.finalize();

  return zipPath;
};

module.exports = {
  createScormPackage,
};
