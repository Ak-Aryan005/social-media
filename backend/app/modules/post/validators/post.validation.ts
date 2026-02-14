import Joi from "joi";

export const createPostValidation = {
  body: Joi.object().keys({
    caption: Joi.string().max(2200).optional(),
    media: Joi.array()
      .items(
        Joi.object().keys({
          type: Joi.string().valid("image", "video").required(),
          url: Joi.string().uri().required(),
        })
      )
      .min(1)
      .required(),
    location: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
};

export const updatePostValidation = {
  body: Joi.object().keys({
    caption: Joi.string().max(2200).optional(),
    location: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
};

export const getPostValidation = {
  params: Joi.object().keys({
    postId: Joi.string().required(),
  }),
};

