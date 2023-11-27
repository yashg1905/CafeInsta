const User= require('../models/user')

module.exports.renderLoginPage=(req,res)=>{
   res.render('user/login')
  
}
module.exports.renderRegisterPage=(req,res)=>{
   res.render('user/register')
  
}

module.exports.logout=(req,res)=>{
   req.logout();
   req.flash('success','Logged Out!');
  res.redirect('/campgrounds')
}

module.exports.register=async(req,res)=>{
   try{
   const {username, email,password}=req.body;
   const user= new User({email,username})
   const newUser= await User.register(user,password);
   req.login(newUser,err=>{
       if(err) return next(err);
       req.flash('success','Successfully registered!!!');
       res.redirect('/campgrounds')
   })
   }
   catch(e)
   {
       req.flash('error',e.message);
       res.redirect('/register')
   }
   
}

module.exports.login=(req,res)=>{
   req.flash('success','Welcome!!');
   const redirectUrl= req.session.returnTo||'/campgrounds';
   delete req.session.returnTo;
   res.redirect(redirectUrl)
}