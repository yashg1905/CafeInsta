const express = require('express');
const router= express.Router({mergeParams:true});
const catchAsync=require('../utils/catchAsync')
const ExpressError=require("../utils/ExpressError")
const User= require('../models/user')
const passport=require('passport')
const users=require('../controllers/user')

router.route('/register')
    .get(users.renderRegisterPage)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLoginPage)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),users.login)

router.get('/logout',users.logout)




module.exports=router;