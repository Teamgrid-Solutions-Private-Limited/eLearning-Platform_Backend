module.exports = {
  ROLES: {
    ADMIN: 'Admin',
    INSTRUCTOR: 'Instructor',
    STUDENT: 'Student',
    AUTHOR: 'Author'
  },
  
  PERMISSIONS: {
    MANAGE_USERS: 'manage_users',
    MANAGE_COURSES: 'manage_courses',
    VIEW_COURSES: 'view_courses',
    TAKE_COURSES: 'take_courses',
    MANAGE_SCORM: 'manage_scorm',
    VIEW_REPORTS: 'view_reports',
    MANAGE_MODULES: 'manage_modules',
    MANAGE_LESSONS: 'manage_lessons',
    MANAGE_QUIZZES: 'manage_quizzes',
    MANAGE_MEDIA: 'manage_media',
    VIEW_ANALYTICS: 'view_analytics'
  },
  
  ROLE_PERMISSIONS: {
    admin: [
      'manage_users',
      'manage_courses',
      'view_courses',
      'take_courses',
      'manage_scorm',
      'view_reports',
      'manage_modules',
      'manage_lessons',
      'manage_quizzes',
      'manage_media',
      'view_analytics'
    ],
    instructor: [
      'manage_courses',
      'view_courses',
      'take_courses',
      'manage_scorm',
      'view_reports'
    ],
    student: [
      'view_courses',
      'take_courses'
    ],
    author: [
      'view_courses',
      'take_courses',
      "manage_modules",
      "manage_lessons",
      "manage_quizzes",
      "manage_media",
      "view_analytics"
    ]
  }
}; 