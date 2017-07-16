function logins($scope,$http,$state){
    $scope.user=""
    $scope.password=""
	$scope.login = function(){
	    if($scope.user==""){
	        alert("请输入用户名！")
	    }else{
	        if($scope.password==""){
	            alert("请输入密码！")
	        }else{
	            $http({
	                url:"/logins",
	                method:"post",
	                params:{"user":$scope.user,"password":$scope.password}
	            }).success(function(res){
	                if(res.code==1){
	                    alert(res.msg)
	                    $state.go("user",{
	                        name:res.result[0].name,
	                        IDs:res.result[0].IDs,
	                        sum:res.result[0].sum
	                    })
	                }else{
	                    alert(res.msg)
	                }
	            })
	        }
	    }
	}
}
function users($scope,$stateParams,$state,$rootScope){
        $scope.name = $stateParams.name
        $rootScope.IDs = $stateParams.IDs
        $rootScope.sum = $stateParams.sum
        $scope.go=function(){
            $state.go("cardmessage",{
                sum:$rootScope.sum
            })
        }
 }
function cardmessages($scope,$stateParams,$http,$rootScope){
    $rootScope.sum = $stateParams.sum
    if($stateParams.price){
        $scope.sum = $stateParams.price
    }
    $scope.unbind = function(){
        $http({
            url:"/unbind",
            method:"post",
            params:{IDs:$rootScope.IDs}
        }).success(function(res){
            if(res.code==1){
            	$scope.info = "确定要解除绑定？"
                $scope.flag1 = true
            }
        })
    }
    $scope.sure1 = function(){
    	$scope.flag1 = false
    }
}
function bindcards($scope,$http,$state){
    $scope.faceCard=""
    $scope.backCard=""
    $scope.name=""
    $scope.ID=""
    $scope.check = function(){
        var reg1 = /^\d{19}$/,
            reg2 = /^\d{6}$/,
            reg3 = /^\d{17}[0-9|x]$/;
        if($scope.faceCard==""||!reg1.test($scope.faceCard)){
            alert("请输入正确的正面卡号(19位数字)")
        }else{
            if($scope.backCard==""||!reg2.test($scope.backCard)){
                alert("请输入正确的背面密码(6位数字)")
            }else{
                if($scope.name==""){
                    alert("请输入购卡时登记的姓名")
                }else{
                    if($scope.ID==""||!reg3.test($scope.ID)){
                        alert("请输入正确的购卡时登记的身份证号码")
                    }else{
                        $http({
                            url:"/cardmessages",
                            method:"post",
                            params:{faceCard:$scope.faceCard,backCard:$scope.backCard,name:$scope.name,ID:$scope.ID}
                        }).success(function(res){
                            if(res.code==1){
                                alert(res.msg)
                                $state.go("recharge",{
                                    faceCard:$scope.faceCard,
                                    total:res.result[0].sum
                                })
                            }else{
                                alert(res.msg)
                            }
                        })
                    }
                }
            }
        }
    }
}
function recharges($scope,$stateParams,$rootScope,$state){
    var reg = /\d+/
    $rootScope.total = $stateParams.total
    $rootScope.card = $stateParams.faceCard
    $scope.arr = ["100","300","500","1000","2000","自定义"]
    $scope.next = function(){
        if($rootScope.txt==""){
            alert("请选择输入充值金额！")
        }else{
            $state.go("sureindent")
        }

    }
    $scope.get = function(){
        if($scope.fund==""){
            $rootScope.txt = ""
        }else{
            if(!reg.test($scope.fund)){
                alert("请输入有效的金额!")
            }else{
                $rootScope.txt = $scope.fund

            }
        }
    }
}
function sureindents($rootScope,$scope,$state){
    $scope.a=""
    $scope.ind = function(index){
        $scope.a = index
    }
    $scope.sure2 = function(){
        if($scope.a==""){
            alert("请选择充值方式！")
        }else{
            if($scope.a==1){
             $state.go("bank1")
            }else if($scope.a==2){
                $state.go("fund")
            } 
        }
    }
}
function bank1s($scope,$http,$rootScope,$state,$timeout){
    $scope.faceCard=""
    $scope.backCard=""
    $scope.flag = false
    var reg1 = /^\d{19}$/,
        reg2 = /^\d{6}$/;
    $scope.sure = function(){
      if($scope.faceCard==""||!reg1.test($scope.faceCard)){
        alert("请输入正确的正面卡号(19位数字)")
        }else{
            if($scope.backCard==""||!reg2.test($scope.backCard)){
                alert("请输入正确的卡密!")
            }else{
                $http({
                    url:"/bank",
                    method:"post",
                    params:{"faceCard":$scope.faceCard,"backCard":$scope.backCard,"IDs":$rootScope.IDs}
                }).success(function(res){
                    $scope.consum = res.result[0].sum
                    if(res.code==1){
                        $http({
                            url:"/banks",
                            method:"post",
                            params:{IDs:$rootScope.IDs}
                        }).success(function(res){
                            $rootScope.all = res.result[0].sum
                        })
                        $timeout(function(){
                            if(res.result[0].sum>=$rootScope.txt){
                            $scope.success = "银行卡充值成功"
                            $scope.info = "充值成功!"
                           var sums = Number($rootScope.all)+ Number($rootScope.txt)
                           var consum = Number($scope.consum)- Number($rootScope.txt)
                            $http({
                                url:"/updates",
                                method:"post",
                                params:{txt:sums,IDs:$rootScope.IDs}
                            }).success(function(res){
                                    if(res.code==1){
                                       $scope.flag1 = true
                                    }
                            })
                            $http({
                                url:"/updates2",
                                method:"post",
                                params:{txt:consum,IDs:$rootScope.IDs}
                            })
                            
                    }else{
                        $scope.success = "银行卡充值失败"
                        $scope.info = "充值失败，余额不足!"
                        $scope.flag2= true
                        $scope.sure1 = function(){
                             $scope.flag2 = false
                          }
                    }
                    $scope.sure1 = function(){
                                $state.go("dealdetail1",{
                                    txt:$rootScope.txt
                                })
                            }
                        },100)
                        
                    }
                  
                })
            }
        }  
    } 
}
function funds($scope,$http,$rootScope,$state,$timeout){
    $scope.faceCard=""
    $scope.backCard=""
    $scope.flag = false
    var reg1 = /^\d{19}$/,
        reg2 = /^\d{6}$/;
    $scope.sure = function(){
      if($scope.faceCard==""||!reg1.test($scope.faceCard)){
        alert("请输入正确的正面卡号(19位数字)")
        }else{
            if($scope.backCard==""||!reg2.test($scope.backCard)){
                alert("请输入正确的卡密!")
            }else{
                $http({
                    url:"/bank",
                    method:"post",
                    params:{"faceCard":$scope.faceCard,"backCard":$scope.backCard,"IDs":$rootScope.IDs}
                }).success(function(res){
                    $scope.consum = res.result[0].sum
                    if(res.code==1){
                        $http({
                            url:"/banks",
                            method:"post",
                            params:{IDs:$rootScope.IDs}
                        }).success(function(res){
                            $rootScope.all = res.result[0].sum
                        })
                        $timeout(function(){
                            if(res.result[0].sum>=$rootScope.txt){
                            $scope.success = "卡资金归集成功"
                            $scope.info = "充值成功!"
                           var sums = Number($rootScope.all)+ Number($rootScope.txt)
                           var consum = Number($scope.consum)- Number($rootScope.txt)
                            $http({
                                url:"/updates",
                                method:"post",
                                params:{txt:sums,IDs:$rootScope.IDs}
                            }).success(function(res){
                                    if(res.code==1){
                                       $scope.flag1 = true
                                    }
                            })
                            $http({
                                url:"/updates2",
                                method:"post",
                                params:{txt:consum,IDs:$rootScope.IDs}
                            })
                    }else{
                        $scope.success = "卡资金归集失败"
                        $scope.info = "充值失败，余额不足!"
                        $scope.flag2 = true
                        $scope.sure1 = function(){
                             $scope.flag2 = false
                          }
                    }
                        },100)
                        
                    }
                  
                })
            }
        }  
        }
        $scope.sure1 = function(){
            $state.go("dealdetail1",{
                txt:$rootScope.txt
            })
        }   
}
function dealdetail1s($scope,$http,$rootScope,$state,$timeout){
    $scope.data = new Date()*1
    $scope.faceCard=""
    $scope.backCard=""
    $scope.flag = false
    var reg1 = /^\d{19}$/,
        reg2 = /^\d{6}$/;
        $scope.look = function(){
            $http({
                url:"/banks",
                method:"post",
                params:{"IDs":$rootScope.IDs}
            }).success(function(res){
                if(res.code==1){
                    $state.go("cardmessage",{
                        price:res.result[0].sum
                    })
                }
            })
        }
    $scope.sure = function(){
      if($scope.faceCard==""||!reg1.test($scope.faceCard)){
        alert("请输入正确的正面卡号(19位数字)")
        }else{
            if($scope.backCard==""||!reg2.test($scope.backCard)){
                alert("请输入正确的卡密!")
            }else{
                $http({
                    url:"/bank",
                    method:"post",
                    params:{"faceCard":$scope.faceCard,"backCard":$scope.backCard,"IDs":$rootScope.IDs}
                }).success(function(res){
                    $scope.consum = res.result[0].sum
                    if(res.code==1){
                        $http({
                            url:"/banks",
                            method:"post",
                            params:{IDs:$rootScope.IDs}
                        }).success(function(res){
                            $rootScope.all = res.result[0].sum
                        })
                        $timeout(function(){
                            if(res.result[0].sum>=$rootScope.txt){
                            $scope.success = "卡资金归集成功"
                            $scope.info = "充值成功!"
                           var sums = Number($rootScope.all)+ Number($rootScope.txt)
                           var consum = Number($scope.consum)- Number($rootScope.txt)
                            $http({
                                url:"/updates",
                                method:"post",
                                params:{txt:sums,IDs:$rootScope.IDs}
                            }).success(function(res){
                                    if(res.code==1){
                                       $scope.flag = true
                                    }
                            })
                            $http({
                                url:"/updates2",
                                method:"post",
                                params:{txt:consum,IDs:$rootScope.IDs}
                            })
                            
                    }else{
                        $scope.success = "卡资金归集失败"
                        $scope.info = "充值失败，余额不足!"
                        $scope.flag = true
                        $scope.sure1 = function(){
                             $scope.flag = false
                            }
                    }

                        },100)
                        
                    }
                  
                })
            }
        }  
        }   
}
function pays($timeout,$scope,$http,$rootScope,$state){
        $scope.text = ""
        $scope.sure = "确定"
        $scope.namee = "优衣库"
    $scope.get = function(e){
        var eve=window.event||e,
            tar = eve.target||eve.srcElement;
        var str = tar.innerText;   
        if(str==""||str==undefined){
            console.error("您点错地方了");
        }
        if(str=="确定"){
            return 
        }
        if(str=="."&&/\./.test($scope.text)){
            return ;
        }   
        if(/\.\d{2}$/.test($scope.text)){
            return;
        }
        
        if($scope.text==""&&str=="."){
            $scope.text = "0.";
            return;
        }
        if(str=="退格"&&$scope.text!=""){
            var len=$scope.text.length,
                val=$scope.text.substr(0,len-1);

            $scope.text=val;
            return;
        }
        if(str=="退格"&&$scope.text==""){
            return;
        }
        $scope.text = $scope.text+str;
    }
    $scope.sure3 = function(){
        $http({
            url:"/banks",
            method:"post",
            params:{IDs:$rootScope.IDs}
        }).success(function(res){
            $rootScope.all = res.result[0].sum
        })
        $timeout(function(){
            var num = Number($rootScope.all)-Number($scope.text)
            if(num>0){
                $state.go("dealsuccess",{
                 price:$scope.text,
                    name :$scope.namee
                })
                $http({
                    url:"/updates",
                    method:"post",
                    params:{txt:num,IDs:$rootScope.IDs}
                })
            }else{
                 $state.go("dealfail",{
                    price:$scope.text,
                    name :$scope.namee
                })
            } 
        },300)
        
    }                        
}
function dealsuccesss($scope,$stateParams,$state){
    $scope.price = $stateParams.price
    $scope.name1 = $stateParams.name
     $scope.data = new Date()*1
     $scope.finish = function(){
        $state.go("dealrecord",{
            "price1":$scope.price,
            "name1":$scope.name1,
        })
     }
}
function dealfails($scope,$stateParams){
    $scope.price = $stateParams.price
    $scope.name1 = $stateParams.name
    $scope.data = new Date()*1
}
function dealrecords($scope,$stateParams,$http,$state,$rootScope){
    $scope.data = new Date()*1
    $scope.name = $stateParams.name1
    $scope.price = $stateParams.price1
     $scope.look = function(){
        $http({
            url:"/banks",
            method:"post",
            params:{"IDs":$rootScope.IDs}
        }).success(function(res){
            if(res.code==1){
                $state.go("cardmessage",{
                    price:res.result[0].sum
                })
            }
        })
    }
}
function resetpwds($scope,$http,$state){
    $scope.ID = ""
    var reg = /^\d{17}[0-9|x]$/;
    $scope.next = function(){
        if($scope.ID==""||!reg.test($scope.ID)){
            alert("请输入正确的购卡时登记的身份证号码")
        }else{

            $http({
                url:"/idCard",
                method:"post",
                params:{ID:$scope.ID},

            }).success(function(res){
                if(res.code==1){
                    $state.go("resetpwd1",{
                        ID:$scope.ID
                    })
                }
            })
        }   
        }
    
}
function resetpwd1s($rootScope,$scope,$stateParams,$http,$state){
   $scope.ID = $stateParams.ID
   $scope.checkCode = ""
    $scope.send = function(){
        $http({
            url:"/sel",
            method:"post",
            params:{ID:$scope.ID}
        }).success(function(res){
            $scope.checkCode = res.result[0].checkCode
        })
    }
    $scope.next = function(){
        if($scope.checkCode==""){
            alert("请获取验证码！")
        }else{
            $scope.text=""
           $scope.flag = true
           $scope.get = function(e){
        var eve=window.event||e,
            tar = eve.target||eve.srcElement;
        var str = tar.innerText;   
        if(str==""||str==undefined){
            console.error("您点错地方了");
        }
        if(str=="确定"){
            return 
        }
        if(str=="."&&/\./.test($scope.text)){
            return ;
        }   
        if(/\.\d{2}$/.test($scope.text)){
            return;
        }
        
        if($scope.text==""&&str=="."){
            $scope.text = "0.";
            return;
        }
        if(str=="退格"&&$scope.text!=""){
            var len=$scope.text.length,
                val=$scope.text.substr(0,len-1);

            $scope.text=val;
            return;
        }
        if(str=="退格"&&$scope.text==""){
            return;
        }
        $scope.text = $scope.text+str;
    }
    $scope.del = function(){
        $scope.flag = false
    }
    $scope.sure3 = function(){
        if($scope.text==""){
            alert("请输入新的密码！")
        }else{
            $scope.flag = false
            $http({
                url:"/uppwd",
                method:"post",
                params:{pwd:$scope.text,IDs:$rootScope.IDs}
            }).success(function(res){
                if(res.code==1){
                    alert("更新密码成功!")
                }
            })
        }
        
    } 
        }
    }
}
angular.module("myapp")
		.controller("logins",logins)
		.controller("users",users)
		.controller("cardmessages",cardmessages)
		.controller("bindcards",bindcards)
		.controller("recharges",recharges)
		.controller("sureindents",sureindents)
		.controller("bank1s",bank1s)
		.controller("funds",funds)
		.controller("dealdetail1s",dealdetail1s)
		.controller("pays",pays)
		.controller("dealsuccesss",dealsuccesss)
		.controller("dealfails",dealfails)
		.controller("dealrecords",dealrecords)
		.controller("resetpwds",resetpwds)
		.controller("resetpwd1s",resetpwd1s)