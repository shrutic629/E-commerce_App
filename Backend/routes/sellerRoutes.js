const express = require('express')
const router = express.Router()
const sellerController = require('../controllers/sellerController')

router.post('/signup',sellerController.signUp)
router.post('/confirm-otp',sellerController.confirmOtp)
router.post('/login',sellerController.login)
router.post('/forgot-password',sellerController.forgotPassword)
router.post('/reset-password',sellerController.resetPassword)


module.exports = router 