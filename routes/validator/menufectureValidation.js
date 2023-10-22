const Joi = require("joi");
const validator = (data) => {
  const shippingSchema = Joi.object({
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
    address: Joi.string().required(),
    reciverName: Joi.string().required(),
  });
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    shopName: Joi.string(),
    address: Joi.string().required(),
    nid: Joi.string(),
    tin: Joi.string(),
    tradeLic: Joi.string(),
    ownerName: Joi.string(),
    ownerAddress: Joi.string(),
    whatsapp: Joi.number(),
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
    ownerNumber: Joi.string()
      .pattern(/(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/)
      .min(11)
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.code) {
            case "any.empty":
              err.message = "Owner Mobile Number should not be empty!";
              break;
            case "string.pattern.base":
              err.message = `Enter Valid Owner Mobile Number`;
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
    shipping: shippingSchema, // Nest the shippingSchema here
  });

  return schema.validate(data);
};

module.exports = validator;
