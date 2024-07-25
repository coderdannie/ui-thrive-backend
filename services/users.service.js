const User = require("../database/models/user");
const getUserByEmail = async (email) => {
    return await User.findOne({email: email}).exec();
}

module.exports = {
    getUserByEmail,
}