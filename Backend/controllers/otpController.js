const Otp = require('../models/otpModel')
const sendEmail = require('../utils/sendEmail')

exports.sendOtp = async({
        purpose,
        userType,
        userId,
        mode,
        email,
        phoneCountryCode,
        phoneNumber
    })=>{
    
        const otp = Math.floor(1000+Math.random()*9000)
        const otpexpiry = new Date(Date.now()+5*60*1000)

        const otpSave = new Otp({otp,otpexpiry,state:'created',purpose,userType,userId,mode,email,phoneCountryCode,phoneNumber})
        await otpSave.save()

        // res.status(200).json({message:`otp sent successfully ${otp} with expiry of 5 minutes`})

        sendEmail()

        return {
            message:'otp sent successfully'
        }
    
}