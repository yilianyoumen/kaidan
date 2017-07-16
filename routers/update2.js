var express = require("express")
var router = express.Router()
var client = require("../config/configsql.js")
router.post("/updates2",function(req,res){
	console.log(req.query)
	console.log(typeof req.query.txt)
        client.query("update info set sum='"+req.query.txt+"'where IDs ='"+req.query.IDs+"'",function(err,result){
        	res.send({"code":1})
        })
})
module.exports = router;