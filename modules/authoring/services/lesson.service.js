const Lesson = require('../models/lesson.model');
const Module = require('../models/module.model');
const Course = require('../models/course.model');
const { NotFoundError, AuthorizationError } = require('../../../shared/errors');

class LessonService {
  async createLesson(data, authorId) {
    // Verify module exists and author has access
    const module = await Module.findById(data.module);
    if (!module) {
      throw new NotFoundError('Module not found');
    }

    const course = await Course.findById(module.course);
    if (course.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to create lesson for this module');
    }

    // Get the next order number
    const lastLesson = await Lesson.findOne({ module: data.module })
      .sort({ order: -1 })
      .select('order');
    data.order = lastLesson ? lastLesson.order + 1 : 0;

    const lesson = await Lesson.create(data);
    return lesson;
  }

  async updateLesson(lessonId, data, authorId) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // Verify module exists and author has access
    const module = await Module.findById(lesson.module);
    const course = await Course.findById(module.course);
    if (course.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to update this lesson');
    }

    Object.assign(lesson, data);
    await lesson.save();
    return lesson;
  }

  async deleteLesson(lessonId, authorId) {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    // Verify module exists and author has access
    const module = await Module.findById(lesson.module);
    const course = await Course.findById(module.course);
    if (course.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to delete this lesson');
    }

    // Reorder remaining lessons
    await Lesson.updateMany(
      { module: lesson.module, order: { $gt: lesson.order } },
      { $inc: { order: -1 } }
    );

    await lesson.remove();
  }

  async reorderLessons(moduleId, lessonIds, authorId) {
    // Verify module exists and author has access
    const module = await Module.findById(moduleId);
    if (!module) {
      throw new NotFoundError('Module not found');
    }

    const course = await Course.findById(module.course);
    if (course.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to reorder lessons for this module');
    }

    // Verify all lessons belong to the module
    const lessons = await Lesson.find({ _id: { $in: lessonIds }, module: moduleId });
    if (lessons.length !== lessonIds.length) {
      throw new NotFoundError('One or more lessons not found or do not belong to this module');
    }

    // Update lesson orders
    const updates = lessonIds.map((lessonId, index) => ({
      updateOne: {
        filter: { _id: lessonId },
        update: { $set: { order: index } }
      }
    }));

    await Lesson.bulkWrite(updates);
  }

  async getLessonById(lessonId) {
    const lesson = await Lesson.findById(lessonId)
      .populate('media', 'url type metadata')
      .populate('quiz', 'title questions settings');

    if (!lesson) {
      throw new NotFoundError('Lesson not found');
    }

    return lesson;
  }

  async getLessonsByModule(moduleId) {
    return Lesson.find({ module: moduleId })
      .populate('media', 'url type metadata')
      .populate('quiz', 'title questions settings')
      .sort('order');
  }

  async getLessonProgress(lessonId, userId) {
    const lesson = await this.getLessonById(lessonId);
    
    // Calculate progress based on lesson type
    let progress = 0;
    switch (lesson.type) {
      case 'video':
        // Implement video progress tracking
        break;
      case 'quiz':
        // Implement quiz progress tracking
        break;
      case 'scorm':
        // Implement SCORM progress tracking
        break;
      default:
        // For other types, check if content was viewed
        progress = lesson.progress?.viewed ? 100 : 0;
    }

    return {
      lessonId,
      progress,
      isCompleted: progress >= 100
    };
  }

  async updateLessonProgress(lessonId, userId, progress) {
    const lesson = await this.getLessonById(lessonId);
    
    // Update progress based on lesson type
    switch (lesson.type) {
      case 'video':
        lesson.progress = {
          ...lesson.progress,
          currentTime: progress.currentTime,
          duration: progress.duration,
          completed: progress.currentTime >= progress.duration
        };
        break;
      case 'quiz':
        lesson.progress = {
          ...lesson.progress,
          score: progress.score,
          completed: progress.score >= lesson.quiz.settings.passingScore
        };
        break;
      case 'scorm':
        lesson.progress = {
          ...lesson.progress,
          status: progress.status,
          score: progress.score,
          completed: progress.status === 'completed'
        };
        break;
      default:
        lesson.progress = {
          ...lesson.progress,
          viewed: true,
          completed: true
        };
    }

    await lesson.save();
    return lesson;
  }
}

module.exports = new LessonService(); 