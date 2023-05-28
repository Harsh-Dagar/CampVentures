const User=require('../models/user');


module.exports.renderRegisterForm=(req,res)=>{
    res.render('userRegistration/signup');
};

module.exports.registerUser=async(req,res,next)=>{
    try{
        const {password,username,email}=req.body;
        const user=new User({username,email});
        const regUser=await User.register(user,password);
        console.log(regUser);
        req.login(regUser, function(err) {
            if (err) { return next(err); }
            req.flash('success','Welcome to CampVentures!!!');
            res.redirect('/campgrounds');
          })

    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
};

module.exports.signInForm=(req,res)=>{
    res.render('userRegistration/signin');
};

module.exports.signInUser=(req,res)=>{
    req.flash('success','Welcome back to CampVentures');
    let redirectpath = res.locals.returnTo ;
    if(!redirectpath)redirectpath='/campgrounds';
    delete res.locals.returnTo;
    res.redirect(redirectpath);
};

module.exports.logoutUser=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
};