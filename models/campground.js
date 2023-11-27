
const mongoose = require('mongoose');
const Review= require('./review');
const Schema =mongoose.Schema;
const User= require('./user');

const imageSchema=new Schema({
    url:String,
    filename:String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_500,h_500')
})
imageSchema.virtual('crop').get(function(){
    return this.url.replace('/upload','/upload/ar_1:1,c_crop')
})
const opts ={ toJSON: { virtuals:true}};

const campgroundSchema= new Schema({
    title: String,
    images:[
        imageSchema
    ],
    price:Number,
    description:String,
    location: String,
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts);

campgroundSchema.virtual('properties.popUp').get(function(){
    return `
    <strong>
    <a href="/campgrounds/${this._id}">${this.title}
    </a>
    </strong>
    <p>&#9906; <b>${this.location}</b></p>`;
})

campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } })
    }
})

module.exports= mongoose.model('Campground',campgroundSchema)
