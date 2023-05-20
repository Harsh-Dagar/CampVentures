const Joi=require('joi');
module.exports.campgroundJOISchema= Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        location:Joi.string().required()
    }).required()
});