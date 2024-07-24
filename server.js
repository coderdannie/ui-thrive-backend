const port = process.env.API_PORT || 3000;
const server = require("./app.js");
const db = require("./database/models");
server.listen(port, () => {
    db.sequelize
        .authenticate()
        .then(() => {
            console.log("Connection has been established successfully.");
        })
        .catch((err) => {
            console.error("Unable to connect to the database:", err);
        });
});