const express = require('express');
const courseRoutes = require('./course.routes');
const moduleRoutes = require('./module.routes');
const lessonRoutes = require('./lesson.routes');
const mediaRoutes = require('./media.routes');
const quizRoutes = require('./quiz.routes');
const slideRoutes = require('./course_slide.routes');
const questionRoutes = require('./question.routes');
const router = express.Router();

// Mount all authoring routes
router.use('/courses', courseRoutes);
router.use('/modules', moduleRoutes);
router.use('/lessons', lessonRoutes);
router.use('/media', mediaRoutes);
router.use('/slides', slideRoutes);
router.use("/questions", questionRoutes);
router.use('/quizzes', quizRoutes);

module.exports = router; 