const express = require('express');
const router= express.Router();
const catchAsync=require('../utils/catchAsync')
const ExpressError=require("../utils/ExpressError")
const Campground= require('../models/campground')
const {reviewSchema,campgroundSchema}=require("../schema")
const {isLoggedIn,isOwner, validateCampground}= require('../miidleware');
const { populate } = require('../models/campground');
const multer= require('multer')
const { storage }= require('../cloudinary/index')
var upload= multer({storage:storage})


const campgrounds= require('../controllers/campground')

router.route('/')
   .get(catchAsync(campgrounds.index))
   .post(isLoggedIn, upload.array('image'),validateCampground ,catchAsync(campgrounds.createCamp))
   
router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
   .get(catchAsync(campgrounds.show))
   .put(isLoggedIn,isOwner,upload.array('image'),validateCampground,catchAsync(campgrounds.update))
   .delete(isLoggedIn,isOwner,catchAsync(campgrounds.deleteCamp))

router.get('/:id/edit',isLoggedIn,isOwner,catchAsync(campgrounds.renderEditForm))


module.exports=router;