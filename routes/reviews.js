const express = require('express');
const router=express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const reviewsCtrl=require('../controllers/reviews');
const {validateReview,isSignedin,authorizeReview}=require('../middleware');



router.post('/',isSignedin, validateReview, catchAsync(reviewsCtrl.createReview));


router.delete('/:rid', isSignedin,authorizeReview,catchAsync(reviewsCtrl.deleteReview));

module.exports=router;