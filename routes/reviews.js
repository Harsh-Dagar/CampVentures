const express = require('express');
const router=express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const Joi = require('joi');

const Campground = require('../models/campground');
const Review = require('../models/review');
const methodOverride = require('method-override');
const {validateReview,isSignedin,authorizeReview}=require('../middleware');



router.post('/',isSignedin, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    console.log(review);
    res.redirect(`/campgrounds/${req.params.id}`);

}))
router.delete('/:rid', isSignedin,authorizeReview,catchAsync(async (req, res) => {
    const { id, rid } = req.params;
    await Review.findByIdAndDelete(rid);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    res.redirect(`/campgrounds/${id}`);
 

}))

module.exports=router;