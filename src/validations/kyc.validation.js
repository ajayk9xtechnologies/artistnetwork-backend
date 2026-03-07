const Joi = require("joi");

const DOCUMENT_TYPES = ["national_id", "passport", "trade_license", "other"];

const submitKycSchema = Joi.object({
  documents: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .valid(...DOCUMENT_TYPES)
          .required(),
        url: Joi.string().uri().required(),
      })
    )
    .min(1)
    .required(),
});

module.exports = {
  submitKycSchema,
};
