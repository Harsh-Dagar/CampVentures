const express=require('express');
const router=express.Router();
const passport=require('passport');
const catchAsync = require('../utils/catchAsync');
const {storeReturnTo}=require('../middleware');
const userRegCtrl=require('../controllers/userReg');



router.get('/register',userRegCtrl.renderRegisterForm);

router.post('/register',catchAsync(userRegCtrl.registerUser));

router.get('/signin',userRegCtrl.signInForm);

router.post('/signin',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/signin'}),userRegCtrl.signInUser);


router.get('/logout',userRegCtrl.logoutUser);

module.exports=router;
