
import Joi from '@hapi/joi';

export const userSchema = {
  firstname: Joi.string()
    .lowercase()
    .trim()
    .required()
    .regex(/^[a-zA-Z]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'firstname can only contain letters';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  lastname: Joi.string()
    .lowercase()
    .trim()
    .required()
    .regex(/^[a-zA-Z]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'lastname can only contain letters';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  username: Joi.string()
    .trim()
    .min(3)
    .max(16)
    .required()
    .regex(/^[a-z0-9_-]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'usernames can only alphanumeric characters, underscores and hyphens';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2 })
    .required(),
  isActive: Joi.boolean(),
  role: Joi.string().valid('god', 'admin', 'moderator', 'user'),
  password: Joi.string()
    .min(8)
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character';
            break;
          default:
            break;
        }
      });
      return errors;
    })
};

export const loginSchema = {
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .min(8)
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character';
            break;
          default:
            break;
        }
      });
      return errors;
    })
};

export const articleSchema = {
  title: Joi.string()
    .trim()
    .required(),

  description: Joi.string()
    .trim()
    .required(),

  articleBody: Joi.string()
    .trim()
    .required(),
  categoryList: Joi.string().trim().min(2),
  tagList: Joi.string()
    // eslint-disable-next-line no-useless-escape
    .regex(/^[a-zA-Z0-9\ \-]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        if (err.type === 'string.regex.base') {
          err.message = 'taglist does not follow the specified format';
        }
      });
      return errors;
    }),

  image: Joi.string()
    .required()
};

export const profileSchema = {
  email: Joi.string().trim().lowercase().email({ minDomainSegments: 2 }),
  bio: Joi.string().lowercase(),
  image: Joi.string(),
  username: Joi.string().trim().min(3).max(16)
    .regex(/^[a-z0-9_-]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'usernames can only be alphanumeric characters, underscores and hyphens';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
};

export const resetPasswordSchema = {
  password: Joi.string()
    .min(8)
    .required()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .error((errors) => {
      errors.forEach((err) => {
        if (err.type === 'string.regex.base') {
          err.message = 'password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character';
        }
      });
      return errors;
    })
};

export const resetEmailSchema = {
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2 })
    .required()
};

export const commentBodySchema = {
  comment: Joi.string()
    .trim()
    .required()
};

export const likesSchema = {
  liked: Joi.boolean().required(),
  type: Joi.string().valid('article', 'comment').required(),
  resourceId: Joi.number().integer().required().min(1)
};

export const bookmarkParamSchema = {
  articleId: Joi.number()
    .required()
};

export const searchFilterSchema = {
  searchQuery: Joi.string().trim().min(2),
  page: Joi.number().integer().optional(),
  limit: Joi.number().integer().optional(),
  categories: Joi.string().allow('').trim(),
  authorNames: Joi.string().allow('').trim(),
  tags: Joi.string().allow('').trim(),
};

export const searchQuerySchema = {
  authorId: Joi.string().allow('').trim(),
  searchQuery: Joi.string().allow('').trim().min(2),
  page: Joi.number().integer().optional(),
  limit: Joi.number().integer().optional()
};
export const roleBodySchema = {
  newRole: Joi.string()
    .trim()
    .valid('god', 'admin', 'moderator', 'user')
    .required(),
  username: Joi.string()
    .trim()
    .required()
};
export const idSchema = {
  id: Joi.number().min(1).required()
};
export const reportArticleSchema = {
  reportId: Joi.number()
};
export const highlightDataSchema = {
  id: Joi.number().integer().required().min(1),
  comment: Joi.string().trim().required(),
  slug: Joi.string()
};

export const getHighlightSchema = {
  id: Joi.number().integer().required().min(1)
};

export const newUserSchema = {
  firstname: Joi.string()
    .lowercase()
    .trim()
    .required()
    .regex(/^[a-zA-Z]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'firstname can only contain letters';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  lastname: Joi.string()
    .lowercase()
    .trim()
    .required()
    .regex(/^[a-zA-Z]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'lastname can only contain letters';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  username: Joi.string()
    .trim()
    .min(3)
    .max(16)
    .required()
    .regex(/^[a-z0-9_-]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'usernames can only alphanumeric characters, underscores and hyphens';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2 })
    .required(),
  isActive: Joi.boolean(),
  role: Joi.string().valid('god', 'admin', 'moderator', 'user'),
};
export const updateUserSchema = {
  firstname: Joi.string()
    .lowercase()
    .trim()
    .required()
    .regex(/^[a-zA-Z]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'firstname can only contain letters';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  lastname: Joi.string()
    .lowercase()
    .trim()
    .regex(/^[a-zA-Z]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'lastname can only contain letters';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  username: Joi.string()
    .trim()
    .min(3)
    .max(16)
    .regex(/^[a-z0-9_-]+$/)
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.type) {
          case 'string.regex.base':
            err.message = 'usernames can only alphanumeric characters, underscores and hyphens';
            break;
          default:
            break;
        }
      });
      return errors;
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2 }),
  isActive: Joi.boolean(),
  role: Joi.string().valid('god', 'admin', 'moderator', 'user'),
};

export const getUserSchema = {
  id: Joi.number().required()
};

export const newSubscriptionSchema = {
  userId: Joi.number().integer().required(),
  firstname: Joi.string().trim().lowercase().required(),
  lastname: Joi.string().trim().lowercase().required(),
  email: Joi.string().trim().lowercase().required(),
  planId: Joi.string().trim().lowercase().required(),
  token: Joi.object().required()
};

export const unsubscribeSchema = {
  userId: Joi.number().integer().required()
};

export const subTokenSchema = {
  cardNumber: Joi.number().integer().required(),
  exp_month: Joi.number().integer().required(),
  exp_year: Joi.number().integer().required(),
  cvc: Joi.number().integer().required(),
};

export const planSchema = {
  name: Joi.string().trim().lowercase().required(),
  interval: Joi.string().trim().lowercase().required(),
  amount: Joi.number().integer().required(),
  currency: Joi.string().trim().lowercase().required(),
};

export const deleteCusSchema = {
  userId: Joi.number().integer().required()
};
