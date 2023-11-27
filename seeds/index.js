const mongoose = require('mongoose');
const campground = require('../models/campground');

const Campground= require('../models/campground')
const cities= require('./cities')
const {places, descriptors}= require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp',
{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log("Mongo Connection open")
})
.catch((err)=>{
  console.log(err,"Mongo Error")
})

const sample=(array)=> array[Math.floor(Math.random()*array.length)]

const seedDb=async()=>{
    await Campground.deleteMany({})
    for(let i=0;i<200;i++)
    {
        const r=Math.floor(Math.random()*20)+10;
        const p=Math.floor(Math.random()*1000)+1;
        const camp =new Campground({
            author:'60ec38ff0471e55a1cf7f1bc',
            location:`${cities[r].city},${cities[r].state}`,
            title:`${sample(places)} ${sample(descriptors)}`,
            images: [
              {
                url: 'https://res.cloudinary.com/yashg1905/image/upload/v1626347525/YelpCamp/ce8fvnm8ci1vuqskg0qe.jpg',
                filename: 'YelpCamp/ce8fvnm8ci1vuqskg0qe'
              },
              {
                url: 'https://res.cloudinary.com/yashg1905/image/upload/v1626347525/YelpCamp/apsd8hf2afbhicc9z8pa.jpg',
                filename: 'YelpCamp/apsd8hf2afbhicc9z8pa'
              }
            ],
            geometry:{
              type: "Point",
              coordinates:[cities[r].longitude , cities[r].latitude ]
            }
            ,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam illum animi quasi voluptates vero accusamus reiciendis laborum dolor laboriosam, nulla quisquam fugiat tenetur earum doloribus, iusto quo optio repudiandae quae',
            price:p
          })
        await camp.save()
    }
}
seedDb()
.then(()=>
{
    mongoose.connection.close()
})
