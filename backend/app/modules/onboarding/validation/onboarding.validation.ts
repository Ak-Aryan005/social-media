import Joi from "joi";

export const updateProfileValidation = {
  body: Joi.object().keys({
    avatar: Joi.string().uri().optional(),
    bio: Joi.string().max(150).optional(),
    coverPhoto: Joi.string().uri().optional(),
  }),
};

export const updateInterestsValidation = {
  body: Joi.object().keys({
    categories: Joi.array().items(Joi.string()).min(1).max(10).required(),
  }),
};

export const updateFollowSuggestionsValidation = {
  body: Joi.object().keys({
    followed: Joi.array().items(Joi.string()).optional(),
    skipped: Joi.boolean().optional(),
  }).or("followed", "skipped"),
};

