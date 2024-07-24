const Joi = require('joi')

const signUpSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    emailToken: Joi.string().required().length(6)
})

const resendOtpSchema = Joi.object({
    email: Joi.string().email().required()
})

module.exports = {
    resendOtpSchema,
    verifyOtpSchema,
    signInSchema,
    signUpSchema
}