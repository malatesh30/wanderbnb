const Listing=require("../models/listing");
const Review=require("../models/review");
module.exports.createReview=async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","new Review created");
    res.redirect(`/listings/${listing._id}`);
}
module.exports.distroyReview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success"," Review Deleted");
    res.redirect(`/listings/${id}`);
}