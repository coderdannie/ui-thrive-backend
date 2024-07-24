require('@dotenvx/dotenvx').config()

const PROD_DB_USER = process.env.PROD_DB_USER
const PROD_DB_NAME = process.env.PROD_DB_NAME
const PROD_DB_PASSWORD = process.env.PROD_DB_PASSWORD
const PROD_DB_HOST = process.env.PROD_DB_HOST
const PROD_DB_PORT = process.env.PROD_DB_PORT
const DEV_DB_USER = process.env['DEV_DB_USER']
const DEV_DB_PASSWORD = process.env['DEV_DB_PASSWORD']
const DEV_DB_NAME = process.env['DEV_DB_NAME']
const DEV_DB_HOST = process.env['DEV_DB_HOST']
const DEV_DB_PORT = process.env.DEV_DB_PORT

module.exports = {
    development: {
        username: DEV_DB_USER,
        password: DEV_DB_PASSWORD,
        database: DEV_DB_NAME,
        host: DEV_DB_HOST,
        dialect: 'mysql',
        port: parseInt(DEV_DB_PORT),
        logging: false,
        dialectOptions: {
            decimalNumbers: true,
        },
    },
    // test: {
    //     username: 'root',
    //     password: '123@XYZ.com?',
    //     database: 'fastadb',
    //     host: '127.0.0.1',
    //     dialect: 'mysql',
    //     port: 8889,
    //     dialectOptions: {
    //         decimalNumbers: true,
    //     },
    // },
    production: {
        username: PROD_DB_USER,
        password: PROD_DB_PASSWORD,
        database: PROD_DB_NAME,
        host: PROD_DB_HOST,
        dialect: 'mysql',
        port: parseInt(PROD_DB_PORT),
        logging: false,
        dialectOptions: {
            decimalNumbers: true,
        },
    },
}

