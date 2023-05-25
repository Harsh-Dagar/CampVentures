const Joi=require('joi');
module.exports.campgroundJOISchema= Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        location:Joi.string().required(),
        description:Joi.string().required()
        
    }).required()
});

module.exports.reviewJOISchema= Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required(),
    }).required()
});