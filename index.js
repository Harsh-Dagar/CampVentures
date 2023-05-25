const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const session=require('express-session');
const flash=require('connect-flash');
const Joi = require('joi');
const { campgroundJOISchema, reviewJOISchema } = require('./JoiSchemas');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');
const campgrounds=require('./routes/campgrounds');
const reviews=require('./routes/reviews');
// mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/camp-venture',{
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
app.use(express.static(path.join(__dirname, 'assets')))

const sessionConfig={
    secret:'randomShit',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+(1000*60*60*24*1),
        maxAge:1000*60*60*24*1
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


app.get('/', (req, res) => {
    res.send("HELLO THIS IS /");
})

app.get('/home', (req, res) => {
    res.render('home');
})


app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

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