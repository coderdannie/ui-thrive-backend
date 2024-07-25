const express = require('express');
const {signup, verifyOtp, signin, resendOtp, sendOtpForPasswordChange, changePassword} = require("../controllers/auth.controller");
const router = express.Router();

router.post ('/signup', signup)
router.post ('/signin', signin)
router.put('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.post('/forgot-password', sendOtpForPasswordChange)
router.post('/change-password', changePassword)


module.exports = router