import Joi from "joi";

export const updateUserValidation = {
  body: Joi.object().keys({
    fullName: Joi.string().min(1).max(100).optional(),
    username: Joi.string().min(1).max(100).optional(),
    bio: Joi.string().max(150).optional(),
    avatar: Joi.string().uri().optional(),
    coverPhoto: Joi.string().uri().optional(),
  }),
};

export const changePasswordValidation = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
  }),
};

export const getUserValidation = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

