import Joi from "joi";

export const registerValidation = {
  body: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    password: Joi.string().min(8).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    // fullName: Joi.string().min(1).max(100).required(),
  }).or('email', 'phone'),
};


export const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().email(),
     phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    password: Joi.string().required(),
  }).or('email', 'phone'),
};

export const refreshTokenValidation = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const PasswordValidation = {
  body: Joi.object().keys({
    email: Joi.string().email(),
     phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  }).or('email', 'phone'),
};

export const resetPasswordValidation = {
  body: Joi.object().keys({
    oldpassword: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
};

export const verifyEmailValidation = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    code:Joi.string().required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  }).or('email', 'phone'),
};

