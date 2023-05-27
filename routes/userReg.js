const express=require('express');
const router=express.Router();
const User=require('../models/user');
const passport=require('passport');
const catchAsync = require('../utils/catchAsync');
const {storeReturnTo}=require('../middleware');



router.get('/register',(req,res)=>{
    res.render('userRegistration/signup');
})

router.post('/register',catchAsync(async(req,res,next)=>{
    try{
        const {password,username,email}=req.body;
        const user=new User({username,email});
        const regUser=await User.register(user,password);
        console.log(regUser);
        req.login(regUser, function(err) {
            if (err) { return next(err); }
            req.flash('success','Welcome to CampVentures!!!');
            res.redirect('/campgrounds');
          })

    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}))

router.get('/signin',(req,res)=>{
    res.render('userRegistration/signin');
})

router.post('/signin',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/signin'}),(req,res)=>{
    req.flash('success','Welcome back to CampVentures');
    const redirectpath = res.locals.returnTo ;
    if(!redirectpath)redirectpath='/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectpath);
})
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
})

module.exports=router;
