const Role = require('../../modules/user/models/role.model');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const role = await Role.findById(req.user.role_id);
      console.log('Role fetched for permission check:', role);
      
      if (!role || !role.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          status: 'error',
          message: 'You do not have permission to perform this action'
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  checkPermission
}; 