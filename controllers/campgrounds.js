const Campground = require('../models/campground');



module.exports.index=async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewCampForm=(req, res) => {
    // res.send(req.user);
    res.render('campgrounds/new');
}

module.exports.createNewCamp=async (req, res, next) => {
    const campground = await new Campground(req.body.campground);
    campground.author=req.user._id;
    await campground.save();
    // console.log(campground);
    req.flash('success','Campground is Successfully created!!!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderCamp=async (req, res, next) => {
    const { id } = req.params;
    const campground =  await Campground.findById(id).populate({
        path:'reviews', 
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(campground);
    if(!campground){
        req.flash('error','Campground not found!!!');
        return res.redirect('/campgrounds');
    }
    console.log(campground);
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm=async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });

};

module.exports.editCamp=async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','Campground is Successfully updated!!!!');
    return res.redirect(`/campgrounds/${id}`);

};

module.exports.deleteCamp=async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Campground is Successfully Deleted!!!!');
    res.redirect('/campgrounds');
};