const Otp = require('../models/otpModel');
const sendEmail = require('../utils/sendEmail');

const generateAndSendOtp = async ({
        purpose, 
        userType, 
        userId, 
        mode, 
        email,
        phoneCountryCode,
        phoneNumber}) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const otpDoc = await Otp.create({
      otp,
      otpExpiry,
      purpose,
      state: 'created',
      userType,
      userId,
      mode,
      email,
      phoneCountryCode,
      phoneNumber
    });

    // Send the OTP to the customer
    await sendEmail({
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`
    });

    // Update OTP state to 'sent' after sending successfully
    otpDoc.state = 'sent';
    await otpDoc.save();
}

module.exports = generateAndSendOtp;