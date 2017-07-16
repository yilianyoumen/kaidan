var express = require("express")
var router = express.Router()
var client = require("../config/configsql.js")
router.post("/sel",function(req,res){
		console.log(req.query)
        client.query("select * from info where identity= '"+req.query.ID+"'",function(err,result){
        	if(result!=""){
            res.send({"code":1,"msg":"登录成功！","result":result})
        	}else{
        	res.send({"code":0,"msg":"用户名或密码有误！"})	
        	}
        })
})
module.exports = router;