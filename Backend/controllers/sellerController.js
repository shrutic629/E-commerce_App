const mongoose = require('mongoose')
const Seller = require('../models/sellerModel')
const Otp =require('../models/otpModel')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')
const generateAndSendOtp = require('../services/otpService')

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

        const existingOtpwithEmail = await Otp.findOne({otp,email})
        if(!existingOtpwithEmail){
            return res.status(400).json({message:"Invalid otp or email"})
        }

        if(Date.now()>existingOtpwithEmail.otpExpiry){
            return res.status(400).json({message:"Otp expired"})
        }

        res.status(200).json({message:"Otp matched successfully"})
    }
    catch(err){
        next(err)
    }
}

exports.login = async(req,res,next)=>{
    try{
        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const existingSeller = await Seller.findOne({email}).select('+password')
        if(!existingSeller){
            return res.status(400).json({message:"Seller does not exist"})
        }

        const comparePassword = await bcrypt.compare(password,existingSeller.password)
        if(!comparePassword){
            return res.status(400).json({message:"Password does not match"})
        }

        const token = jwt.sign({id:existingSeller._id,email:existingSeller.email,firstName:existingSeller.firstName,
            lastName:existingSeller.lastName},process.env.SECRET_KEY,{expiresIn:"1h"})

        const existingseller = existingSeller.toObject()
        delete existingseller.password

        res.status(200).json({message:"Login successful",Token:token,existingSeller:existingseller})
    }
    catch(err){
        next(err)
    }
}

exports.forgotPassword = async(req,res,next)=>{
    try{
        const {email} = req.body;

        if(!email){
            return res.status(400).json({message:"Email is required"})
        }

        const existingSeller = await Seller.findOne({email})
        if(!existingSeller){
            return res.status(400).json({message:"Seller doesnt exist"})
        }

        await generateAndSendOtp({
            purpose:"forgotPassword",
            userType:"Seller",
            userId:existingSeller._id,
            mode:'email',
            phoneCountryCode:null,
            phoneNumber:null,
            email:email
        })

        res.status(200).json({message:'Otp sent successfully'})
    }
    catch(err){
        next(err)
    }
}

exports.resetPassword = async(req,res,next)=>{
    try{
        const {email,otp,password} = req.body

        if(!email || !otp || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const otpwithEmail = await Otp.findOne({otp,email})
        if(!otpwithEmail){
            return res.status(400).json({message:"Otp not found"})
        }

        if(Date.now() > otpwithEmail.otpExpiry ){
            return res.status(400).json({message:"Otp expired"})
        }

        const existingseller = await Seller.findOne({email})
        if(!existingseller){
            return res.status(400).json({message:"Seller doesnt exist"})
        }

        existingseller.password = password
        await existingseller.save()

        res.status(200).json({message:"Password reset successfully"})

    }
    catch(err){
        next(err)
    }
}