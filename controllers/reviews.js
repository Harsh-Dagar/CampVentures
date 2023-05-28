const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview=async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    console.log(review);
    res.redirect(`/campgrounds/${req.params.id}`);

};

module.exports.deleteReview=async (req, res) => {
    const { id, rid } = req.params;
    await Review.findByIdAndDelete(rid);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: rid } });
    res.redirect(`/campgrounds/${id}`);
};