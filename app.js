if(process.env.NODE_ENV!="production")
{
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const passport=require('passport');
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const ExpressError=require("./utils/ExpressError.js")



const listingsRouter=require("./routs/listing.js");
const reviewsRouter=require("./routs/review.js");
const userRouter=require("./routs/user.js");
const { error } = require("console");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsmate)
app.use(express.static(path.join(__dirname,"/public")));


const dbUrl=process.env.ATLASDB;
main()
.then((res)=>{
    console.log(`connected to db`);
})
.catch((err) =>{ 
    console.log("NOT Connected");
    console.log(err)
});

async function main() {
  await mongoose.connect(dbUrl);
}

// app.get("/",(req,res)=>{
//     res.send("hi");
// })
const store= MongoStore.create({ mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
   })
   store.on(("error"),()=>{
    console.log("error in mongoose session store",error);
   })
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true,
    },
  }));
  
  app.use(flash());
  app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
// app.get("/demo",async (req,res)=>{
// let fakeuser1=new user({
//     email:"abcd@gmail.com",
//     username:"abcd1234",
// })
// const registeredUser= await user.register(fakeuser1,"hello")
// res.send(registeredUser);
// })



app.use("/listings",listingsRouter);
// reviews
app.use("/listings/:id/reviews",reviewsRouter)
app.use("/", userRouter);
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("listening to port 8080");
})