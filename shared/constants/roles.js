module.exports = {
  ROLES: {
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    STUDENT: 'student'
  },
  
  PERMISSIONS: {
    MANAGE_USERS: 'manage_users',
    MANAGE_COURSES: 'manage_courses',
    VIEW_COURSES: 'view_courses',
    TAKE_COURSES: 'take_courses',
    MANAGE_SCORM: 'manage_scorm',
    VIEW_REPORTS: 'view_reports'
  },
  
  ROLE_PERMISSIONS: {
    admin: [
      'manage_users',
      'manage_courses',
      'view_courses',
      'take_courses',
      'manage_scorm',
      'view_reports'
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
    ]
  }
}; 