const Listing=require("./models/listing");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must logged in to create listings");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor=async(req,res,next)=>{
    let { id,reviewid } = req.params;
    let review=await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validatelistings=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}
module.exports.validateSchema=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}
