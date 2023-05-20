const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const Joi = require('joi');
const {campgroundJOISchema}=require('./JoiSchemas');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
// mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/camp-venture', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to Database!!!");
}).catch((err) => {
    console.log("Error IN connecting to database!!!!");
    console.log(err);
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const validateCampground=(req,res,next)=>{
    const { error } = campgroundJOISchema.validate(req.body);
    if (error) {
        const msg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    next();
}



app.get('/', (req, res) => {
    res.send("HELLO THIS IS /");
})

app.get('/home', (req, res) => {
    res.render('home');
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})
app.post('/campgrounds',validateCampground, catchAsync(async (req, res, next) => {
    const campground = await new Campground(req.body.campground);
    campground.save();
    console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`);
}))
app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(campground);
    res.render('campgrounds/show', { campground });
}))
app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });

}))
app.put('/campgrounds/:id', validateCampground,catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);

}))
app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})
app.use((err, req, res, next) => {
    const { message = 'Something went wrong', statusCode = 500 } = err;
    res.status(statusCode).render('error', { err });

})


app.listen(port, () => {
    console.log(`Serving on port ${port} SUCCESSFULLY!!!`);
})  