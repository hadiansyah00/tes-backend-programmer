const Joi = require("joi");

exports.register = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

exports.login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.updateProfile = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
});

exports.topup = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount harus berupa angka",
    "number.positive": "Amount harus lebih besar dari 0",
    "any.required": "Amount wajib diisi",
  }),
});
