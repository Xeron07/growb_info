const Joi = require("joi");

const validator = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number(),
    unitPrice: Joi.number(),
    discount: Joi.number(),
  });

  return schema.validate(data);
};

module.exports = validator;
