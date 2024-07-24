const generateNumericToken = require("../helpers/tokenGenerator");
const {signUpSchema, signInSchema, verifyOtpSchema, resendOtpSchema} = require("../validations/validation.schema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const usersService = require("../services/users.service");
const {sendOTP} = require("../services/mailer.service");
require('dotenv').config()
const signup = async (req, res) => {
    try {
        const {error} = signUpSchema.validate(req.body);
        if (error) return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });

        const {firstName, lastName, email, password} = req.body
        const existingUser = await usersService.getUserByEmail(email)
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User exists with provided email'
            })
        }

        const emailToken = generateNumericToken(6)

        await usersService.createUser({firstName, lastName, email, password, emailToken})
        // sendOTP(email, emailToken)
        return res.status(201).json({
            success: true,
            message: "Signup successful! Check email for OTP",
            otp: emailToken
        })

    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }


}

const signin = async (req, res) => {
    try {
        const {error} = signInSchema.validate(req.body);
        if (error) return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
        const {email, password} = req.body
        const user = await usersService.getUserByEmail(email)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (!user.emailVerified) {
            return res.status(401).json({
                success: false,
                message: 'Email not verified'
            })
        }

        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'User or password not match'
            })
        }

        const payload = {userId: user.id}
        const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: 60 * 60})

        return res.status(200)
            .json({
                success: true,
                message: 'Sign in successful!',
                accessToken: token
            })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }

}

const verifyOtp = async (req, res) => {
    try {
        const {error} = verifyOtpSchema.validate(req.body);
        if (error) return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
        const {email, emailToken} = req.body
        const user = await usersService.getUserByEmail(email)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const difInMillisecond = new Date().getTime() - new Date(user.tokenExpiration).getTime()
        let timeDiff = Math.round(difInMillisecond / 1000 / 60)

        if (timeDiff > 1) {
            return res.status(400).json({
                success: false,
                message: 'Expired otp!'
            })
        }

        if (user.emailToken !== emailToken) {
            return res.status(400).json({
                success: false,
                message: 'Invalid otp'
            })
        }

        await user.update({emailToken: null, emailVerified: true})

        return res.status(200).json({
            success: true,
            message: "Otp verification successful"
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const resendOtp = async (req, res) => {
    try {
        const {error} = resendOtpSchema.validate(req.body)
        if (error){
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }
        const {email} = req.body
        const user = await usersService.getUserByEmail(email)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const emailToken = generateNumericToken(6)
        await user.update({
            emailToken,
            emailVerified: false,
            tokenExpiration: new Date()
        })
        // sendOTP(user.email, emailToken)
        return res.status(200).json({
            success: true,
            message: "Otp resent!",
            otp: emailToken
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

module.exports = {
    signin,
    resendOtp,
    verifyOtp,
    signup
}