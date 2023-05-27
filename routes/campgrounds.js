const express = require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const { campgroundJOISchema } = require('../JoiSchemas');
const {isSignedin}=require('../middleware');

const Campground = require('../models/campground');
const methodOverride = require('method-override');

const validateCampground = (req, res, next) => {
    const { error } = campgroundJOISchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}



router.get('/new',isSignedin, (req, res) => {
    // res.send(req.user);
    res.render('campgrounds/new');
})
router.post('/',isSignedin, validateCampground, catchAsync(async (req, res, next) => {
    const campground = await new Campground(req.body.campground);
    await campground.save();
    console.log(campground);
    req.flash('success','Campground is Successfully created!!!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error','Campground not found!!!');
        return res.redirect('/campgrounds');
    }
    console.log(campground);
    res.render('campgrounds/show', { campground });
}))
router.get('/:id/edit',isSignedin, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });

}))
router.put('/:id',isSignedin, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','Campground is Successfully updated!!!!');
    res.redirect(`/campgrounds/${id}`);

}))
router.delete('/:id',isSignedin, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Campground is Successfully Deleted!!!!');
    res.redirect('/campgrounds');
}))


module.exports=router;