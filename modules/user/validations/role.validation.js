const Joi = require('joi');
const { PERMISSIONS } = require('../../../shared/constants/roles');

const createRoleSchema = Joi.object({
  name: Joi.string().required().valid('Admin', 'Author', 'Learner'),
  permissions: Joi.array().items(Joi.string().valid(...Object.values(PERMISSIONS))).required(),
  description: Joi.string().allow(''),
  isActive: Joi.boolean()
});

const updateRoleSchema = Joi.object({
  name: Joi.string().valid('Admin', 'Author', 'Learner'),
  permissions: Joi.array().items(Joi.string().valid(...Object.values(PERMISSIONS))),
  description: Joi.string().allow(''),
  isActive: Joi.boolean()
});

module.exports = {
  createRoleSchema,
  updateRoleSchema
}; 