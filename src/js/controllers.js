//var SideNavModule = angular.module('SideNavModule', []);
app.controller('SideNavCtrl', function($scope, $http, $state, $stateParams) {

		$scope.list = {
			"parent": {
						"title": "主页",
						"url": "index.html"
					},
					
			"items":[
				{
					"title": "商品管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-laptop",
					"child": [{
							"title": "单一商品",
							"url": ".goodsSingle",
							"isActive":true
						},{
							"title": "组合商品",
							"url": ".goodsMulti",
							"isActive":false
					  }]					
				},
				{
					"title": "店铺管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-book",
					"child": [{
							"title": "在售商品",
							"url": ".storeSale",
							"isActive":false
						},{
							"title": "商品陈列",
							"url": ".storeDisplay",
							"isActive":false
					  }]					
				},
				{
					"title": "订单管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-cogs",
					"child": [{
							"title": "订单输入",
							"url": ".orderAdd",
							"isActive":false
						},{
							"title": "订单查询",
							"url": ".orderQuery",
							"isActive":false
					  },{
							"title": "订单审核",
							"url": ".orderAudit",
							"isActive":false
						},{
							"title": "退货处理",
							"url": ".orderRefund",
							"isActive":false
					  }]					
				},{
					"title": "仓库管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-envelope",
					"child": [{
							"title": "货位管理",
							"url": ".wareInventory",
							"isActive":false
						},{
							"title": "库存管理",
							"url": ".wareStorage",
							"isActive":false
					  }]					
				},{
					"title": "配送管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-tasks",
					"child": [{
							"title": "配载管理",
							"url": ".distrLoad",
							"isActive":false
						},{
							"title": "车辆管理",
							"url": ".distrVehicle",
							"isActive":false
					  }]					
				},{
					"title": "统计分析",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-bar-chart-o",
					"child": [{
							"title": "订单统计",
							"url": ".statistics",
							"isActive":false
						}]					
				},{
					"title": "用户管理",
					"url": "javascript:;",
					"isActive":false,
					"icon":"fa fa-th-list",
					"child": [{
							"title": "用户管理",
							"url": ".userManage",
							"isActive":false
						}]					
				}
		]
}
		$scope.isActive = false;
		$scope.listToggle = function(index){
			$scope.list.items[index].isActive = !$scope.list.items[index].isActive;
		}
	})
	.controller('loginCtl', function($scope, http,$state) {

		$scope.loginInfo = {
			user: '',
			pwd: ''
		}

		var userInfoUrl = './src/data/login.json';

		$scope.login = function() {
			
			console.log("login info:" + JSON.stringify($scope.loginInfo));
			
			if (!$scope.loginInfo.user) {
				alert("请输入用户名");
				return;
			} 
			if (!$scope.loginInfo.pwd) {
				alert("请输入密码");
				return;
			} 
			
			http.get(userInfoUrl).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					
					angular.forEach(respone.user, function(value, key) {
						console.log(key + ': ' + value.password+"   "+ $scope.loginInfo.pwd);
						if(value.name == $scope.loginInfo.user){
							if (value.password == $scope.loginInfo.pwd) {
								alert("登录成功");
								$state.go('home');
							} else{
								alert("密码错误")
							}	
							return;
						}
						
						if(key == respone.user.length-1){
							alert("用户不存在");
						}
						
					});
				},
				function(respone) {
					console.log("login failed!" + JSON.stringify(respone));
					alert("请求登录失败,请检查网络!");
				});
		}
	})