if(process.env.NODE_env!=="production")
{
    require('dotenv').config()
}



const express = require('express');
const app= express()
const path= require('path')
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate')
const Campground= require('./models/campground')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')
const localStrategy=require('passport-local')
const User= require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet')
const MongoDBStore= require("connect-mongo");


const {reviewSchema,campgroundSchema}=require("./schema")

const campgroundRoute=require("./routes/campground")
const reviewRoute=require("./routes/review")
const userRoute=require("./routes/user")

// process.env.DB_URL 
// 'mongodb://localhost:27017/yelp-camp'
const dbUrl='mongodb://localhost:27017/yelp-camp' 
// const dbUrl=process.env.DB_URL;

const catchAsync=require('./utils/catchAsync')
const ExpressError=require("./utils/ExpressError")
mongoose.connect(dbUrl,
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(()=>{
  console.log("Mongo Connection open")
})
.catch((err)=>{
  console.log(err,"Mongo Error")
})
app.engine('ejs',ejsMate)
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))

const secret=process.env.SECRET || 'thisisascret';

const store= MongoDBStore.create({
    mongoUrl:dbUrl,
    secret, 
    touchAfter:30*60
});

store.on("error",function(e){
    console.log("Session store error",e)
})


const config={
    store,
    name:'session',
    secret:secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(mongoSanitize({
    replaceWith: '_',
  }));

app.use(session(config))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const methodOverride=require('method-override');
const { title } = require('process');
const { descriptors } = require('./seeds/seedHelpers');
const { required } = require('joi');
const exp = require('constants');
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))


app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/yashg1905/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(flash());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
res.locals.messages=req.flash('success')
res.locals.error=req.flash('error')
next();
})


app.use('/',userRoute)
app.use('/campgrounds',campgroundRoute)
app.use('/campgrounds/:id/reviews',reviewRoute)

app.get('/',(req,res)=>{
    res.render('home')
})

app.all("*",(req,res,next)=>{
    next(new ExpressError("Page not found!!",404))
})
app.use((err,req,res,next)=>{
    const{ status=500, message="Something went wrong"}=err
    res.status(status).render('error',{err})
})

const port= process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Listening...")
})
