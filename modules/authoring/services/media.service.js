const Media = require('../models/media.model');
const Lesson = require('../models/lesson.model');
const { NotFoundError, AuthorizationError } = require('@shared/errors');
const { uploadToStorage, deleteFromStorage } = require('@shared/utils/storage');

class MediaService {
  async uploadMedia(file, data, authorId) {
    // Upload file to storage
    const uploadResult = await uploadToStorage(file, 'media');
    
    // Create media record
    const media = await Media.create({
      ...data,
      author: authorId,
      url: uploadResult.url,
      type: file.mimetype,
      size: file.size,
      metadata: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        ...uploadResult.metadata
      }
    });

    return media;
  }

  async getMediaById(mediaId) {
    const media = await Media.findById(mediaId);
    if (!media) {
      throw new NotFoundError('Media not found');
    }
    return media;
  }

  async getMediaByType(type) {
    return Media.find({ type });
  }

  async updateMedia(mediaId, data, authorId) {
    const media = await Media.findById(mediaId);
    if (!media) {
      throw new NotFoundError('Media not found');
    }

    if (media.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to update this media');
    }

    Object.assign(media, data);
    await media.save();
    return media;
  }

  async deleteMedia(mediaId, authorId) {
    const media = await Media.findById(mediaId);
    if (!media) {
      throw new NotFoundError('Media not found');
    }

    if (media.author.toString() !== authorId) {
      throw new AuthorizationError('Not authorized to delete this media');
    }

    // Delete file from storage
    await deleteFromStorage(media.url);

    // Remove media references from lessons
    await Lesson.updateMany(
      { media: mediaId },
      { $pull: { media: mediaId } }
    );

    await media.remove();
  }

  async getMediaUsage(mediaId) {
    const media = await Media.findById(mediaId);
    if (!media) {
      throw new NotFoundError('Media not found');
    }

    // Find all lessons using this media
    const lessons = await Lesson.find({ media: mediaId })
      .select('title module')
      .populate('module', 'title course')
      .populate('course', 'title');

    return {
      mediaId,
      totalUsage: lessons.length,
      lessons: lessons.map(lesson => ({
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        moduleId: lesson.module._id,
        moduleTitle: lesson.module.title,
        courseId: lesson.module.course._id,
        courseTitle: lesson.module.course.title
      }))
    };
  }
}

module.exports = new MediaService(); 