const Joi = require("joi");
const validator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    type: Joi.string().required(),
    mobileNumber: Joi.string()
      .pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)
      .min(11)
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case "any.empty":
              err.message = "Mobile Number should not be empty!";
              break;
            case "string.pattern.base":
              err.message = `Enter Valid Mobile Number`;
              break;
            case "string.max":
              err.message = `Value should have at most ${err.local.limit} characters!`;
              break;
            default:
              break;
          }
        });
        return errors;
      }),
    password: Joi.string().required(),
    nid: Joi.string(),
    token: Joi.string(),
    type: Joi.string(),
  });

  return schema.validate(data);
};

module.exports = validator;
