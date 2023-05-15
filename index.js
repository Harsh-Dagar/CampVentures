const express=require('express');
const app=express();
const port=3000;
const path=require('path');
const ejsMate=require('ejs-mate');
const mongoose=require('mongoose');
const Campground = require('./models/campground');
const methodOverride=require('method-override');
// mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/camp-venture', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Successfully connected to Database!!!");
}).catch((err)=>{
    console.log("Error IN connecting to database!!!!");
    console.log(err);
})

app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views')); 

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


app.get('/',(req,res)=>{
    res.send("HELLO THIS IS /");
})

app.get('/home',(req,res)=>{
    res.render('home');
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds',async(req,res)=>{
    const campground=await new Campground(req.body.campground);
    campground.save();
    console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`);
})
app.get('/campgrounds',async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})

app.get('/campgrounds/:id',async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    console.log(campground);
    res.render('campgrounds/show',{campground});
})
app.get('/campgrounds/:id/edit',async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    res.render('campgrounds/edit',{campground});
    
})
app.put('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${id}`);

})
app.delete('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(port,()=>{
    console.log(`Serving on port ${port} SUCCESSFULLY!!!`);
})  