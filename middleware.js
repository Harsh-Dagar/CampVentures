const { campgroundJOISchema, reviewJOISchema } = require('./JoiSchemas');
const ExpressError = require('./utils/expressError');
const Campground = require('./models/campground') ;
const Review = require('./models/review') ;


module.exports.isSignedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be signed in!!!');
        return res.redirect('/signin');
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundJOISchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}
module.exports.authorized=async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You dont have permission!!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.authorizeReview=async(req,res,next)=>{
    const {rid,id}=req.params;
    const review=await Review.findById(rid);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You dont have permission!!!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJOISchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
}
