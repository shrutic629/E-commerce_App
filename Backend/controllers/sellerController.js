const mongoose = require('mongoose')
const Seller = require('../models/sellerModel')
const Otp =require('../models/otpModel')
const sendEmail = require('../utils/sendEmail')

exports.signUp = async(req,res,next)=>{
    try{
        const {firstName,lastName,email,password,phoneCountryCode,phoneNumber} = req.body;
        if(!(firstName && lastName && email && password && phoneCountryCode && phoneNumber)){
            return res.status(400).json({message:'All fields are required'})
        }

        const existingSeller = await Seller.findOne({email})
        if(existingSeller){
            return res.status(400).json({message:"Seller already exist"})
        }

        const seller = new Seller({firstName,lastName,email,password,phoneCountryCode,phoneNumber})
        await seller.save()

        await generateAndSendOtp({
            purpose: 'signup',
            userType: 'Seller',
            userId: seller._id,
            mode: 'email',
            email,
            phoneCountryCode,
            phoneNumber
        })

        const duplicateSeller = seller.toObject()
        delete duplicateSeller.password

        res.status(200).json({message:"Seller created successfully",seller:duplicateSeller})
    }
    catch(err){
        next(err)
    }
}

exports.confirmOtp = async(req,res,next)=>{
    try{
        const {otp,email} = req.body

        if(!(otp && email)){
            return res.status(400).json({message:"All fields are required"})
        }

        
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