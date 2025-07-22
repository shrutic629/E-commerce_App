const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController')

router.post('/signup',customerController.signup)
router.post('/confirm-otp',customerController.confirmOtp)
router.post('/login',customerController.login)
router.post('/forgot-password',customerController.forgotPassword)
router.post('/reset-password',customerController.resetPassword)

module.exports = router;