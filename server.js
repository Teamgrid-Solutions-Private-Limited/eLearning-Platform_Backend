require('module-alias/register');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const path = require('path');
const connectDB = require('@shared/config/db');
const { initializeDirectories } = require('./shared/utils/initDirectories');

// Verify environment variables
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');

// Import routes
const authoringRoutes = require('./modules/authoring/routes');
const roleRoutes = require('./modules/user/routes/role.routes');
/* Commented out other modules for now
const scormRoutes = require('./modules/scorm/routes');
const lmsRoutes = require('./modules/lms/routes');
*/
const userRoutes = require('./modules/user/routes');

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

// Mount routes
app.use('/api', userRoutes);
app.use('/api/authoring', authoringRoutes);
app.use('/api/roles', roleRoutes);
/* Commented out other routes for now
app.use('/api/scorm', scormRoutes);
app.use('/api/lms', lmsRoutes);
*/

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    await initializeDirectories();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 