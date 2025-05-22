const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth } = require('../../../shared/middlewares/auth.middleware');
const { authorize } = require('../../../shared/middlewares/auth.middleware');
const { ROLES } = require('../../../shared/constants/roles');
const { checkPermission } = require('../../../shared/middlewares/role.middleware');
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  publishCourse
} = require('../controllers/course.controller');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only zip files
    if (file.mimetype === 'application/zip') {
      cb(null, true);
    } else {
      cb(new Error('Only zip files are allowed'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Apply authentication middleware to all routes
router.use(auth);

// Get all courses
router.get('/', getCourses);

// Get course by ID
router.get('/:id', getCourse);

// Create new course (instructor/admin only)
router.post('/',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_courses'),
  upload.single('content'),
  createCourse
);

// Update course (instructor/admin only)
router.patch('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_courses'),
  upload.single('content'),
  updateCourse
);

// Delete course (instructor/admin only)
router.delete('/:id',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_courses'),
  deleteCourse
);

// Publish course (instructor/admin only)
router.post('/:id/publish',
  authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),
  checkPermission('manage_courses'),
  publishCourse
);

module.exports = router; 