const express = require('express');
const router=express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Joi = require('joi');
const { campgroundJOISchema, reviewJOISchema } = require('../JoiSchemas');

const Campground = require('../models/campground');
const Review = require('../models/review');
const methodOverride = require('method-override');


const validateReview = (req, res, next) => {
    const { error } = reviewJOISchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${req.params.id}`);

}))
router.delete('/:rid', catchAsync(async (req, res) => {
    const { id, rid } = req.params;
    await Review.findByIdAndDelete(rid);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    res.redirect(`/campgrounds/${id}`);
 

}))

module.exports=router;