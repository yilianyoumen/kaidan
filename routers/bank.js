var express = require("express")
var router = express.Router()
var client = require("../config/configsql.js")
router.post("/bank",function(req,res){
        client.query("select * from info where cardCod = '"+req.query.faceCard+"'&& password = '"+req.query.backCard+"'",function(err,result){
        	console.log(result)
        	if(result!=""){
            res.send({"code":1,"msg":"登录成功！","result":result})
        	}else{
        	res.send({"code":0,"msg":"用户名或密码有误！"})	
        	}
        })
})
module.exports = router;
