const mongoose = require('mongoose');
require('@dotenvx/dotenvx').config()
const {CONNECTION_STRING} = process.env
exports.connectToDB = async() => {
    try {
        await mongoose.connect(`${CONNECTION_STRING}`)
        console.log("Connected to DB")
    } catch (e) {
        console.error(e)
    }
}

