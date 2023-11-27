const Campground= require('../models/campground')
const Review= require('../models/review')

module.exports.createReview=async(req,res,next)=>{
    
   const c=await Campground.findById(req.params.id)
   const r= new Review(req.body.review)
   r.author=req.user._id
   c.reviews.push(r);
   await r.save();
   await c.save();
   req.flash('success','Review added!!')
   res.redirect(`/campgrounds/${c._id}`)
}

module.exports.deleteReview=async(req,res)=>{
   const{id,rId}= req.params;
   await Campground.findByIdAndUpdate(id,{$pull:{reviews:rId}})
   await Review.findByIdAndDelete(rId, {runValidators:true})
   req.flash('success','Review successfully deleted!!')
   res.redirect(`/campgrounds/${id}`)
}