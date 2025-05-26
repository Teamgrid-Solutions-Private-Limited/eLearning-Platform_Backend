const Course = require('../models/course.model');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');
const { fileUtils } = require('../../../shared/utils/fileUtils');

// Create new course
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, scormVersion, metadata, settings } = req.body;
  
  // Handle file upload
  const contentPath = await fileUtils.moveFile(
    req.file.path,
    `public/scorm-content/${req.file.filename}`
  );

  const course = await Course.create({
    title,
    description,
    scormVersion,
    author: req.user.id,
    contentPath,
    metadata,
    settings
  });

  res.status(201).json({
    status: 'success',
    data: { course }
  });
});

// Get all courses
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .populate('author', 'name email')
    .sort('-createdAt');

  res.json({
    status: 'success',
    data: { courses }
  });
});

// Get course by ID
const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('author', 'name email');

  if (!course) {
    return res.status(404).json({
      status: 'error',
      message: 'Course not found'
    });
  }

  res.json({
    status: 'success',
    data: { course }
  });
});

// Update course
const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, metadata, settings } = req.body;
  
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      status: 'error',
      message: 'Course not found'
    });
  }

  // Check if user is the author
  if (course.author.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to update this course'
    });
  }

  // Handle file upload if new content is provided
  if (req.file) {
    await fileUtils.deleteFile(course.contentPath);
    const contentPath = await fileUtils.moveFile(
      req.file.path,
      `public/scorm-content/${req.file.filename}`
    );
    course.contentPath = contentPath;
  }

  course.title = title || course.title;
  course.description = description || course.description;
  course.metadata = { ...course.metadata, ...metadata };
  course.settings = { ...course.settings, ...settings };

  await course.save();

  res.json({
    status: 'success',
    data: { course }
  });
});

// Delete course
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      status: 'error',
      message: 'Course not found'
    });
  }

  // Check if user is the author
  if (course.author.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to delete this course'
    });
  }

  // Delete course content
  await fileUtils.deleteFile(course.contentPath);
  await course.remove();

  res.json({
    status: 'success',
    message: 'Course deleted successfully'
  });
});

// Publish course
const publishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      status: 'error',
      message: 'Course not found'
    });
  }

  // Check if user is the author
  if (course.author.toString() !== req.user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to publish this course'
    });
  }

  course.status = 'published';
  await course.save();

  res.json({
    status: 'success',
    data: { course }
  });
});

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  publishCourse
}; 