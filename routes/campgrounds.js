const express = require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const campgroundCtrl=require('../controllers/campgrounds');

const{authorized,validateCampground,isSignedin}=require('../middleware');



router.get('/new',isSignedin,campgroundCtrl.renderNewCampForm);


router.post('/',isSignedin, validateCampground, catchAsync(campgroundCtrl.createNewCamp));


router.get('/', catchAsync(campgroundCtrl.index));


router.get('/:id', catchAsync(campgroundCtrl.renderCamp));


router.get('/:id/edit',isSignedin,authorized,catchAsync(campgroundCtrl.renderEditForm));


router.put('/:id',isSignedin,authorized, validateCampground, catchAsync(campgroundCtrl.editCamp));


router.delete('/:id',isSignedin,authorized, catchAsync(campgroundCtrl.deleteCamp));


module.exports=router;