const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")

const Review = require("../models/review");
const Listing = require("../models/listing");
const {validateSchema, isLoggedIn, isAuthor}=require("../middleware.js");
const reviewcontroller = require("../controllers/review.js");


router.post("/",validateSchema,isLoggedIn,wrapAsync(reviewcontroller.createReview))
//delete review route
router.delete("/:reviewid",isLoggedIn,isAuthor, wrapAsync(reviewcontroller.distroyReview))
module.exports=router;