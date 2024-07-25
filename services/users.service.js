const bcrypt = require('bcryptjs');
const {User} = require("../database/models/user");
console.log(User)
const getUserByEmail = async (email) => {
    return await User.findOne({email: email}).exec();
}
// const createUser = async (userData) => {
//     try {
//         const user = new User({
//             firstName: userData.firstName,
//             lastName: userData.lastName,
//             email: userData.email,
//             emailToken: userData.emailToken,
//             password: bcrypt.hashSync(userData.password, parseInt(process.env['SALT'])),
//         })
//         await user.save()
//     } catch (e) {
//         console.error(e)
//     }
// }

module.exports = {
    getUserByEmail,
    // createUser,
}