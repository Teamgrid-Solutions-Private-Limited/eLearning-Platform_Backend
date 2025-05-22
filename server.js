require('module-alias/register');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authoringRoutes = require('./modules/authoring/routes');
/* Commented out other modules for now
const scormRoutes = require('./modules/scorm/routes');
const lmsRoutes = require('./modules/lms/routes');
const userRoutes = require('./modules/user/routes');
*/

// Import middlewares
const { errorHandler } = require('./shared/middlewares/error.middleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/authoring', authoringRoutes);
/* Commented out other routes for now
app.use('/api/scorm', scormRoutes);
app.use('/api/lms', lmsRoutes);
app.use('/api/users', userRoutes);
*/

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 