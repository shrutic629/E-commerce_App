const mongoose = require('mongoose')
const Seller = require('../models/sellerModel')

exports.signUp = async(req,res,next)=>{
    try{
        const {firstName,lastName,email,password,phoneCountryCode,phoneNumber} = req.body;
    }
    catch(err){
        next(err)
    }
}

exports.confirmOtp = async(req,res,next)=>{
    try{

    }
    catch(err){
        next(err)
    }
}

exports.login = async(req,res,next)=>{
    try{

    }
    catch(err){
        next(err)
    }
}

exports.forgotPassword = async(req,res,next)=>{
    try{

    }
    catch(err){
        next(err)
    }
}

exports.resetPassword = async(req,res,next)=>{
    try{

    }
    catch(err){
        next(err)
    }
}