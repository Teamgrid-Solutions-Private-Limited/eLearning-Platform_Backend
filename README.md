# TGS E-Learning Backend

A SCORM-based e-learning backend system built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tgs-elearning-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following configuration:
```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1
API_PREFIX=/api

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/tgs-elearning
MONGODB_USER=admin
MONGODB_PASS=your_secure_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# File Storage Configuration
STORAGE_TYPE=local
STORAGE_PATH=uploads
MAX_FILE_SIZE=52428800
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Running Tests
```bash
npm test
```

## Project Structure

```
tgs-elearning-backend/
├── modules/
│   ├── authoring/         # Course authoring module
│   ├── scorm/            # SCORM package handling
│   ├── lms/              # Learning management system
│   └── user/             # User management
├── shared/
│   ├── config/           # Configuration files
│   ├── middlewares/      # Common middlewares
│   ├── utils/            # Utility functions
│   └── errors/           # Error handling
├── uploads/              # File uploads directory
├── logs/                 # Application logs
├── tests/                # Test files
├── .env                  # Environment variables
├── server.js            # Application entry point
└── package.json         # Project dependencies
```

## API Documentation

The API documentation is available at `/api-docs` when running the server.

## Features

- SCORM package generation and management
- Course authoring and management
- User authentication and authorization
- File upload and management
- Progress tracking
- Quiz and assessment management
- Media management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 