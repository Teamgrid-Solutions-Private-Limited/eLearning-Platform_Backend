const eventBus = require('./eventBus');

// SCORM Event Types
const SCORM_EVENTS = {
  COURSE_STARTED: 'course.started',
  COURSE_COMPLETED: 'course.completed',
  COURSE_FAILED: 'course.failed',
  LESSON_STARTED: 'lesson.started',
  LESSON_COMPLETED: 'lesson.completed',
  INTERACTION_ATTEMPTED: 'interaction.attempted',
  INTERACTION_COMPLETED: 'interaction.completed',
  SCORE_UPDATED: 'score.updated',
  PROGRESS_UPDATED: 'progress.updated'
};

// Event Handlers
const handleCourseStarted = (data) => {
  // Handle course started event
  console.log('Course started:', data);
};

const handleCourseCompleted = (data) => {
  // Handle course completed event
  console.log('Course completed:', data);
};

// Subscribe to events
eventBus.subscribe(SCORM_EVENTS.COURSE_STARTED, handleCourseStarted);
eventBus.subscribe(SCORM_EVENTS.COURSE_COMPLETED, handleCourseCompleted);

module.exports = {
  SCORM_EVENTS,
  eventBus
}; 