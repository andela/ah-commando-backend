import Joi from '@hapi/joi';

export const userSchema = {
  firstname: Joi.string().lowercase().trim().required()
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
  lastname: Joi.string().lowercase().trim().required()
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
  username: Joi.string().trim().min(3).max(16)
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
  email: Joi.string().trim().lowercase().email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string().min(8).required()
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
    }),
};

export const loginSchema = {
  email: Joi.string().trim().lowercase().email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string().min(8).required()
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
    }),
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
