const Joi = require('joi');
const { ROLES } = require('../../../shared/constants/roles');

const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  role_id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
});

const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema
}; 