const User = require('../models/user.model');
const { generateToken } = require('../../../shared/utils/token');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');

// Register new user
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  const token = generateToken({ id: user._id, role: user.role });

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password'
    });
  }

  const token = generateToken({ id: user._id, role: user.role });

  res.json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    }
  });
});

// Get user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  
  res.json({
    status: 'success',
    data: { user }
  });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    status: 'success',
    data: { user }
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
}; 