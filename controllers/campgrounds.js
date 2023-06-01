const Campground = require('../models/campground');
const {cloudinary}=require('../cloudinary/index');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken});


module.exports.index=async (req, res, next) => {
    const campgrounds = await Campground.find({});
    console.log(campgrounds[0]);
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewCampForm=(req, res) => {
    // res.send(req.user);
    res.render('campgrounds/new');
}

module.exports.createNewCamp=async (req, res, next) => {
    const geodata=await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
      }).send();
        
    const campground = await new Campground(req.body.campground);
    campground.geometry=geodata.body.features[0].geometry;
    campground.images=req.files.map((f)=>({
        url:f.path, filename: f.filename
    }));
    campground.author=req.user._id;
    await campground.save();
    console.log(campground);
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
    // console.log(campground);

    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm=async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });

};

module.exports.editCamp=async (req, res, next) => {
    const { id } = req.params;
    const camp=await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgarr=req.files.map((f)=>({
        url:f.path, filename: f.filename
    }));
    camp.images.push(...imgarr);
    await camp.save();
    // console.log(req.body);

    if (req.body.deleteImages) {
    console.log("**********",req.body.deleteImages,"**********");

        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success','Campground is Successfully updated!!!!');
    return res.redirect(`/campgrounds/${id}`);

};

module.exports.deleteCamp=async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Campground is Successfully Deleted!!!!');
    res.redirect('/campgrounds');
};