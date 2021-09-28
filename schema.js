const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extensions = (joi) => ({
  type: 'string',
 base: joi.string(),
messages: {
 'string.escapeHTML' : '{{#label}} must not include HTML!'
},
 rules: {
   escapeHTML: {
      validate(value, helpers){
        const clean = sanitizeHtml(value, {
         allowedTags: [],
         allowedAttributes: {},
       });
       if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
      }
   }
  }
}
)

const Joi = BaseJoi.extend(extensions)

module.exports.apartmentSchema = Joi.object({
    apartment: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    location: Joi.string().required().escapeHTML(),
    // images: Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
    BHK: Joi.string().valid('Studio', '1', '2', '3', 'Penthouse').escapeHTML(),
    amenities: Joi.string().escapeHTML()
    }).required(),
    deleteImages: Joi.array(),
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})