var mysql = require("mysql")
var client = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"root",
    port:3306,
    database:"student"
})
client.connect();
module.exports = client