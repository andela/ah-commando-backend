import Joi from '@hapi/joi';
import utils from './Utilities';

const validate = (object, schema, req, res, next) => {
  const { error, value } = Joi.validate(object, schema, { abortEarly: false });

  if (error) {
    return utils.errorStat(res, 400, error.details.map((detail) => {
      const message = detail.message.replace(/"/gi, '');
      return message;
    }));
  }
  req.body[Object.keys(req.body)[0]] = value;
  return next();
};

export default validate;
