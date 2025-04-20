const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js")

const Listing = require("../models/listing");
const {isLoggedIn,isOwner,validatelistings}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


router
    .route("/")
    .get( wrapAsync(listingcontroller.index))
    .post( upload.single("listing[image]"), validatelistings,wrapAsync(listingcontroller.createListing))

// new route
router.get("/new", isLoggedIn,listingcontroller.renderNewForm);

router
    .route("/:id")
    .get( wrapAsync(listingcontroller.showListing))
    .put(isLoggedIn,isOwner, upload.single("listing[image]"),validatelistings,wrapAsync(listingcontroller.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingcontroller.distroyListing));
 
//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingcontroller.renderEditform));


module.exports=router;