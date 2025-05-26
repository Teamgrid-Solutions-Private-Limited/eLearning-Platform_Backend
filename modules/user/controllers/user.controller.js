const User = require('../models/user.model');
const Role = require('../models/role.model');
const { generateToken } = require('../../../shared/utils/token');
const asyncHandler = require('../../../shared/middlewares/asyncHandler');

// Register new user
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role_id } = req.body;
  
  const user = await User.create({
    name,
    email,
    password,
    role_id
  });

  // Populate role details for response
  await user.populate('role_id');

  const token = generateToken({ id: user._id, role_id: user.role_id._id, roleName: user.role_id.name });

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role_id.name,
        role_id: user.role_id._id,
        permissions: user.role_id.permissions
      },
      token
    }
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate('role_id');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password'
    });
  }

  const token = generateToken({ id: user._id, role_id: user.role_id._id, roleName: user.role_id.name });

  res.json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role_id.name,
        role_id: user.role_id._id,
        permissions: user.role_id.permissions
      },
      token
    }
  });
});

// Get user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password').populate('role_id');
  res.json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role_id?.name,
        role_id: user.role_id?._id,
        permissions: user.role_id?.permissions
      }
    }
  });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  ).select('-password').populate('role_id');

  res.json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role_id?.name,
        role_id: user.role_id?._id,
        permissions: user.role_id?.permissions
      }
    }
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
}; 