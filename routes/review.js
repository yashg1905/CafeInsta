const express = require('express');
const router= express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync')
const ExpressError=require("../utils/ExpressError")
const Campground= require('../models/campground')
const Review= require('../models/review')
const {reviewSchema,campgroundSchema}=require("../schema.js")
const {validateReview,isLoggedIn,isReviewOwner}= require('../miidleware')


const reviews=require('../controllers/review')




router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))


router.delete('/:rId',isLoggedIn,isReviewOwner,catchAsync(reviews.deleteReview))

module.exports=router;