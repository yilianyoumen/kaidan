
var logins = require("../routers/login.js")
var cardmessages = require("../routers/cardmessages.js")
var bank = require("../routers/bank.js")
var banks = require("../routers/banks.js")
var updates = require("../routers/update.js")
var updates2 = require("../routers/update2.js")
var idCard = require("../routers/idCard.js")
var sel = require("../routers/sel.js")
var uppwd = require("../routers/uppwd.js")
var unbind = require("../routers/unbind.js")
module.exports = function(app){
    app.post("/logins",logins)
    app.post("/bank",bank)
    app.post("/banks",banks)
    app.post("/updates",updates)
    app.post("/updates2",updates2)
    app.post("/idCard",idCard)
    app.post("/sel",sel)
    app.post("/uppwd",uppwd)
    app.post("/unbind",unbind)
    app.post("/cardmessages",cardmessages)
}