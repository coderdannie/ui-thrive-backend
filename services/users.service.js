const bcrypt = require('bcryptjs');
const db = require("../database/models");
const {User} = db.sequelize.models
require('dotenv').config()
const getUserByEmail = async (email) => {
    return await User.findOne({
        where: {
            email: email
        }
    })
}
const createUser = async (userData) => {
    try {
        return await User.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            emailToken: userData.emailToken,
            password: bcrypt.hashSync(userData.password, parseInt(process.env['SALT'])),
            tokenExpiration: new Date()
        })
    } catch (e) {
        console.error(e)
    }
}


module.exports = {
    getUserByEmail,
    createUser,
}