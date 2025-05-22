const { ROLE_PERMISSIONS } = require('../constants/roles');

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have the required permission to perform this action'
      });
    }

    next();
  };
};

module.exports = {
  checkPermission
}; 