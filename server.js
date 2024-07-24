 
let port = process.env.PORT || 3000;
let server = require("./app.js");
const db = require("./database/models");
server.listen(port, () => {
    db.sequelize
        .authenticate()
        // .sync({ force: true })
        .then(() => {
            console.log("Connection has been established successfully.");
        })
        .catch((err) => {
            console.error("Unable to connect to the database:", err);
        });
});