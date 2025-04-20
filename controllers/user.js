const user=require("../models/user.js");
module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    try{
        let{email,username,password}=req.body;
    const newUser=user({email,username});
    const registeredUser=await user.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WonderLust");
    res.redirect("/listings");
    })
    
    }
    catch(err){
        req.flash("error",err.message)
        res.redirect("/signup");
    }
};
module.exports.renderLoginform=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req,res)=>{
    req.flash("success","welcome to WonderLust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
};