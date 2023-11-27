const Campground= require('../models/campground')
const{cloudinary}=require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken= process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken: mbxToken})

module.exports.index=async (req,res)=>{
    const campgrounds= await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
}

module.exports.createCamp=async(req,res,next)=>{
    const geodata=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const c=new Campground(req.body.campground)
    c.geometry=geodata.body.features[0].geometry;
    c.author=req.user._id;
    c.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    await c.save();
    console.log(c)
    req.flash('success','New cafe created!!')
    res.redirect(`/campgrounds/${c.id}`)
}

module.exports.show=async (req,res)=>{
    const c=await Campground.findById(req.params.id).populate({path:'reviews',populate:{
        path:'author'
    }}).populate('author')
    if(!c)
    {
        req.flash('error','Cafe not found!!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{c})
}

module.exports.renderNewForm=(req,res)=>{
    
    res.render('campgrounds/new')
}

module.exports.renderEditForm=async (req,res)=>{
    const{id}= req.params;
    const c=await Campground.findById(req.params.id)
    if(!c)
    {
        req.flash('error','Cafe not found!!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{c})
}

module.exports.update=async(req,res)=>{
    const{id}= req.params;
    const c=req.body.campground
    const camp=await Campground.findByIdAndUpdate(id,{...c})
    const img=req.files.map(f=>({url:f.path,filename:f.filename}));
    camp.images.push(...img);
    await camp.save();
    if(req.body.deleteImages){
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        for(let f of req.body.deleteImages){
            await cloudinary.uploader.destroy(f);
        }
    }
    
    
    
    req.flash('success','Cafe edited!!')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCamp=async(req,res)=>{
    const{id}= req.params;
    await Campground.findByIdAndDelete(id, {runValidators:true})
    req.flash('success','Cafe successfully deleted!!')
    res.redirect(`/campgrounds`)
}