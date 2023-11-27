const ExpressError=require("./utils/ExpressError")
const Campground= require('./models/campground')
const {reviewSchema,campgroundSchema}=require("./schema.js")
const Review= require('./models/review')

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.returnTo=req.originalUrl
        req.flash('error','You must be logged in!')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground= (req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else
    next()
}
module.exports.isOwner=async(req,res,next)=>{
    const{id}= req.params;
    const camp =await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error','You do not have the permission to edit!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.isReviewOwner=async(req,res,next)=>{
    const{id,rId}= req.params;
    const review =await Review.findById(rId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have the permission to edit!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.validateReview= (req,res,next)=>{
    
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else
    next();
}



