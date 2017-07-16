var express = require("express")
var router = express.Router()
var client = require("../config/configsql.js")
router.post("/cardmessages",function(req,res){
        client.query("select * from info where name = '"+req.query.name+"'&& cardCod = '"+req.query.faceCard+"'&& identity='"+req.query.ID+"'&&password = '"+req.query.backCard+"'",function(err,result){
        	if(result!=""){
            res.send({"code":1,"msg":"绑定成功！","result":result})
        	}else{
        	res.send({"code":0,"msg":"输入信息有误！"})	
        	}
        })


})
module.exports = router;