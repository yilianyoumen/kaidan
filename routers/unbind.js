var express = require("express")
var router = express.Router()
var client = require("../config/configsql.js")
router.post("/unbind",function(req,res){
        client.query("delete from info where IDs='"+req.query.IDs+"'",function(err,result){
        	console.log(result)
        	if(result!=""){
            res.send({"code":1,"msg":"登录成功！","result":result})
        	}else{
        	res.send({"code":0,"msg":"用户名或密码有误！"})	
        	}
        })
})
module.exports = router;
