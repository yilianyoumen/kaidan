var express = require("express")
var router = express.Router()
var client = require("../config/configsql.js")
router.post("/uppwd",function(req,res){
	console.log(req.query.IDs)
	console.log(typeof req.query.pwd)
        client.query("update login set password='"+req.query.pwd+"'where IDs ='"+req.query.IDs+"'",function(err,result){
        	res.send({"code":1})
        })
})
module.exports = router;