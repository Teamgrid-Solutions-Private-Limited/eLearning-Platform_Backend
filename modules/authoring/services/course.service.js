const Course = require('../models/course.model');
const ScormBuilder = require('../../scorm/builder/builder');
const { fileUtils } = require('../../../shared/utils/fileUtils');

class CourseService {
  async createCourse(data, authorId, contentFile) {
    // Create SCORM package
    const scormBuilder = new ScormBuilder(data.scormVersion);
    const packagePath = await scormBuilder.createPackage(contentFile, {
      title: data.title,
      description: data.description,
      ...data.metadata
    });

    // Create course record
    const course = await Course.create({
      ...data,
      author: authorId,
      contentPath: packagePath
    });

    return course;
  }

  async updateCourse(courseId, data, authorId, contentFile) {
    const course = await Course.findById(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    if (course.author.toString() !== authorId) {
      throw new Error('Not authorized to update this course');
    }

    // If new content is provided, create new SCORM package
    if (contentFile) {
      const scormBuilder = new ScormBuilder(course.scormVersion);
      const packagePath = await scormBuilder.createPackage(contentFile, {
        title: data.title || course.title,
        description: data.description || course.description,
        ...data.metadata
      });

      // Delete old content
      await fileUtils.deleteFile(course.contentPath);
      course.contentPath = packagePath;
    }

    // Update course data
    Object.assign(course, data);
    await course.save();

    return course;
  }

  async deleteCourse(courseId, authorId) {
    const course = await Course.findById(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    if (course.author.toString() !== authorId) {
      throw new Error('Not authorized to delete this course');
    }

    // Delete course content
    await fileUtils.deleteFile(course.contentPath);
    await course.remove();
  }

  async publishCourse(courseId, authorId) {
    const course = await Course.findById(courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }

    if (course.author.toString() !== authorId) {
      throw new Error('Not authorized to publish this course');
    }

    course.status = 'published';
    await course.save();

    return course;
  }

  async getCourses(filters = {}) {
    const query = Course.find(filters)
      .populate('author', 'name email')
      .sort('-createdAt');

    return query;
  }

  async getCourseById(courseId) {
    const course = await Course.findById(courseId)
      .populate('author', 'name email');

    if (!course) {
      throw new Error('Course not found');
    }

    return course;
  }
}

module.exports = new CourseService(); 