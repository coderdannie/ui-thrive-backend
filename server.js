require('@dotenvx/dotenvx').config()
const port = process.env["API_PORT"];
const server = require("./app.js");
const {connectToDB} = require("./database/config");
server.listen(port, async() => {
    await connectToDB()
    console.log('Server is running')
});