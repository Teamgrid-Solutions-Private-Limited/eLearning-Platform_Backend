const Module = require('../models/module.model');
const Course = require('../models/course.model');
const { NotFoundError, AuthorizationError } = require('@shared/errors');

class ModuleService {
  async createModule(data, authorId) {
    // Verify course exists and author has access
    const course = await Course.findById(data.course);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    if (course.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to create module for this course');
    }

    // Get the next order number
    const lastModule = await Module.findOne({ course: data.course })
      .sort({ order: -1 })
      .select('order');
    data.order = lastModule ? lastModule.order + 1 : 0;

    const module = await Module.create(data);
    return module;
  }

  async updateModule(moduleId, data, authorId) {
    const module = await Module.findById(moduleId);
    if (!module) {
      throw new NotFoundError('Module not found');
    }

    // Verify course exists and author has access
    const course = await Course.findById(module.course);
    if (course.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to update this module');
    }

    Object.assign(module, data);
    await module.save();
    return module;
  }

  async deleteModule(moduleId, authorId) {
    const module = await Module.findById(moduleId);
    if (!module) {
      throw new NotFoundError('Module not found');
    }

    // Verify course exists and author has access
    const course = await Course.findById(module.course);
    if (course.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to delete this module');
    }

    // Reorder remaining modules
    await Module.updateMany(
      { course: module.course, order: { $gt: module.order } },
      { $inc: { order: -1 } }
    );

    await module.remove();
  }

  async reorderModules(courseId, moduleIds, authorId) {
    // Verify course exists and author has access
    const course = await Course.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    if (course.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to reorder modules for this course');
    }

    // Verify all modules belong to the course
    const modules = await Module.find({ _id: { $in: moduleIds }, course: courseId });
    if (modules.length !== moduleIds.length) {
      throw new NotFoundError('One or more modules not found or do not belong to this course');
    }

    // Update module orders
    const updates = moduleIds.map((moduleId, index) => ({
      updateOne: {
        filter: { _id: moduleId },
        update: { $set: { order: index } }
      }
    }));

    await Module.bulkWrite(updates);
  }

  async getModuleById(moduleId) {
    const module = await Module.findById(moduleId)
      .populate('lessons', 'title type duration order')
      .populate('requiredLessons', 'title type duration order');

    if (!module) {
      throw new NotFoundError('Module not found');
    }

    return module;
  }

  async getModulesByCourse(courseId) {
    return Module.find({ course: courseId })
      .populate('lessons', 'title type duration order')
      .sort('order');
  }

  async getModuleProgress(moduleId, userId) {
    const module = await this.getModuleById(moduleId);
    
    // Calculate completion based on criteria
    let progress = 0;
    switch (module.completionCriteria) {
      case 'all_lessons':
        progress = module.lessons.reduce((acc, lesson) => 
          acc + (lesson.isCompleted ? 1 : 0), 0) / module.lessons.length * 100;
        break;
      case 'minimum_score':
        // Implement score-based progress calculation
        break;
      case 'specific_lessons':
        progress = module.requiredLessons.reduce((acc, lesson) => 
          acc + (lesson.isCompleted ? 1 : 0), 0) / module.requiredLessons.length * 100;
        break;
    }

    return {
      moduleId,
      progress,
      isCompleted: progress >= 100
    };
  }
}

module.exports = new ModuleService(); 