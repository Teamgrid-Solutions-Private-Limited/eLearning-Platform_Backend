class CourseDTO {
  static toResponse(course) {
    return {
      id: course._id,
      title: course.title,
      description: course.description,
      scormVersion: course.scormVersion,
      status: course.status,
      author: {
        id: course.author._id,
        name: course.author.name,
        email: course.author.email
      },
      metadata: course.metadata,
      settings: course.settings,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    };
  }

  static toListResponse(courses) {
    return courses.map(course => ({
      id: course._id,
      title: course.title,
      description: course.description,
      scormVersion: course.scormVersion,
      status: course.status,
      author: {
        id: course.author._id,
        name: course.author.name
      },
      createdAt: course.createdAt
    }));
  }

  static toCreateRequest(data) {
    return {
      title: data.title,
      description: data.description,
      scormVersion: data.scormVersion,
      metadata: data.metadata,
      settings: data.settings
    };
  }

  static toUpdateRequest(data) {
    const updateData = {};
    
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.metadata) updateData.metadata = data.metadata;
    if (data.settings) updateData.settings = data.settings;

    return updateData;
  }
}

module.exports = CourseDTO; 