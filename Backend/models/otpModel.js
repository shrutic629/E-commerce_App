const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp:{
        type:Number,
        required:true,
        trim:true
    },
    otpExpiry:{
        type:Date,
        required:true,
    },
    purpose:{
        type:String,
        enum:['signup','confirmOtp','forgotPassword','resetPassword'],
        required:true
    },
    state:{
        type:String,
        enum:['created','sent','verified','verification_failed','expired'],
        required:true
    },
    userType:{
        type:String,
        enum:['Customer','Seller']
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"userType"
    },
    mode:{
        type:String,
        enum:['phone','email']
    },
    phoneCountryCode:{
        type:String,
    },
    phoneNumber:{
        type:String,
    },
    email:{
        type:String,
    }

},{timestamps:true,versionKey:false})

const otpModel = mongoose.model('Otp',otpSchema)
module.exports = otpModel;