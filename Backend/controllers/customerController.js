const mongoose = require('mongoose');
const Customer = require('../models/customerModel')
const generateAndSendOtp = require('../services/otpService')
const Otp = require('../models/otpModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

exports.signup = async (req, res, next) => {
  try {
    // Get data from Request
    const { firstName, lastName, email, password, phoneCountryCode, phoneNumber } = req.body;

    // Validate the Request Data (Only Presence)
    if (!(firstName && lastName && email && password && phoneCountryCode && phoneNumber)) {
      return res.status(400).json('All fields are required');
    }

    // Checking if the user already exists?
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json('User already exists');
    }

    // Saving user in the database
    const customer = new Customer({
      firstName,
      lastName,
      email,
      password,
      phoneCountryCode,
      phoneNumber
    });
    await customer.save();

    // Saving OTP in the database
    await generateAndSendOtp({
        purpose: 'signup',
        userType: 'Customer',
        userId: customer._id,
        mode: 'email',
        email,
        phoneCountryCode,
        phoneNumber
    })

    // Send the response to the customer
    const customerResponse = customer.toObject();
    delete customerResponse.password;

    res.status(201).json({
      message: 'User created successfully. OTP sent to email.',
      customer: customerResponse
    });

  } catch (err) {
    next(err);
  }
};


exports.confirmOtp = async(req,res,next)=>{
    try{
        const {email,otp} = req.body;

        if(!(email && otp)){
            return res.status(400).json('All fields are required')
        }

        const existingCustomerWithOtp = await Otp.findOne({otp,email})
        if(!existingCustomerWithOtp){
            return res.status(400).json('User does not exist')
        }

        // if(otp !== existingCustomerWithOtp.otp){
        //     return res.status(400).json('Wrong otp')
        // }

        if(existingCustomerWithOtp.otpExpiry < new Date()){
            existingCustomerWithOtp.state = 'expired'
            await existingCustomerWithOtp.save()
            return res.status(400).json({message:'otp expired'})
        }

        existingCustomerWithOtp.state = 'verified'
        await existingCustomerWithOtp.save()

        res.status(200).json({message:'Otp verified successfully'})

    }
    catch(err){
        next(err)
    }
    
}

exports.login = async(req,res,next)=>{
    try{
        // get data from req.body
        const {email,password} = req.body;

        // check for all fields
        if(!(email && password)){
            return res.status(400).json({message:"All fields are required"})
        }

        // check for existingCustomer
        const existingCustomer = await Customer.findOne({email})
        if(!existingCustomer){
            return res.status(400).json({message:"User does not exist"})
        }

        // match for password
        const checkPassword = await bcrypt.compare(password,existingCustomer.password)
        if(!checkPassword){
            return res.status(400).json({message:"Incorrect Password"})
        }

        // send token
        const token = jwt.sign({id:existingCustomer._id,firstName:existingCustomer.firstName,
            lastName:existingCustomer.lastName},process.env.SECRET_KEY,{expiresIn:'1h'})

        // send response
        res.status(200).json({message:"Login successful",token:token,user:existingCustomer})
    }
    catch(err)
    {
        next(err)
    }
}

exports.forgotPassword = async(req,res,next)=>{
    // get data from req.body
    const {email} = req.body;

    // check for field
    if(!email){
        return res.status(400).json({message:'Email is required'})
    }

    // check for user with entered email
    const existingCustomer = await Customer.findOne({email})
    if(!existingCustomer){
        return res.status(400).json({message:'Email does not exist'})
    }

    // send otp on that email
    generateAndSendOtp({
        purpose:"forgotPassword", 
        userType:"Customer", 
        userId:existingCustomer._id, 
        mode:"email", 
        email,
        phoneCountryCode:null,
        phoneNumber:null
    })

    res.status(200).json({message:'OTP sent to your registered email address'})

}

exports.resetPassword = async(req,res,next)=>{
    // get data from req.body(otp,email,password)
    const {otp,email,password} = req.body

    // check for all fields
    if(!(otp && email && password)){
        return res.status(400).json({message:'All fields are required'})
    }

    // find existingCustomer
    const existingCustomer = await Otp.findOne({otp,email})
    if(!existingCustomer){
        return res.status(400).json({message:'Email having otp doesnt exist'})
    }

    // check otpexpiry
    if(existingCustomer.otpExpiry < new Date()){
        return res.status(400).json({message:'Otp expired'})
    }

    // add password in existingCustomer and save
    existingCustomer.password = password
    await existingCustomer.save()

    // send response
    res.status(200).json({message:'Password reset successfully'})

}