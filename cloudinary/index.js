const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
   cloud_name:process.env.CLOUDINARY_CLOuD_NAME,
   api_key:process.env.CLOUDINARY_KEY,
   api_secret:process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
   cloudinary: cloudinary,
   params:{
   folder: 'YelpCamp',
   allowedFormats:['jpeg','png','jpg']
   }
 });
  
//  const parser = multer({ storage: storage });

module.exports={
   cloudinary, storage
}