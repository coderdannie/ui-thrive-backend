const path = require("node:path");
require('dotenv').config({ path: '../../.env' })
module.exports = {
    development: {
        dialect: 'sqlite',
        storage: path.join(__dirname+'../../../database.sqlite'),
        logging: false,
        dialectOptions: {
            decimalNumbers: true,
        },
    },
}
