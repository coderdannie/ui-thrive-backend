const generateNumericToken = require("../helpers/tokenGenerator");
const {signUpSchema, signInSchema, verifyOtpSchema, resendOtpSchema, forgotPasswordSchema, changePasswordSchema} = require("../validations/validation.schema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const usersService = require("../services/users.service");
const User = require("../database/models/user")
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

        const user = new User({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, parseInt(process.env['SALT']))
        })
        await user.save()
        return res.status(201).json({
            success: true,
            message: "Signup successful",
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

        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'User or password not match'
            })
        }

        const payload = {userId: user._id}
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

const sendOtpForPasswordChange = async(req, res) => {
    try{
        const {error} = forgotPasswordSchema.validate(req.body);
        if (error) return res.status(400).json({
            success: false,
            message: error.details[0].message
        })

        const {email} = req.body
        const user = await usersService.getUserByEmail(email)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        user.emailToken = generateNumericToken(6)
        user.tokenExpiration = new Date()
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Otp sending successful",
        })
    }catch(e){
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

        if (timeDiff > 5) {
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

        user.emailToken = null;
        await user.save()

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
        user.emailToken = emailToken
        user.tokenExpiration = new Date()
        await user.save()

        // sendOTP(user.email, emailToken)
        return res.status(200).json({
            success: true,
            message: "Otp resent!",
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

const changePassword = async(req, res) => {
    try {
        const {error} = changePasswordSchema.validate(req.body)
        if (error) return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
        const existingUser = await usersService.getUserByEmail(req.body.email)
        if (!existingUser) {
            return res.status(404).json({
                success: true,
                message: "User does not exist"
            })
        }
        existingUser.password = bcrypt.hashSync(req.body.password, parseInt(process.env['SALT']))
        await existingUser.save()

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
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
    changePassword,
    sendOtpForPasswordChange,
    signin,
    resendOtp,
    verifyOtp,
    signup
}