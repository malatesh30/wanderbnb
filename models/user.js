
const mongoose=require('mongoose');
const passport = require('passport');
const Schema=mongoose.Schema;
const paasssportLocalMongoose = require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});
userSchema.plugin(paasssportLocalMongoose);
module.exports=mongoose.model("user",userSchema);