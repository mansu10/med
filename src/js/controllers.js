//var SideNavModule = angular.module('SideNavModule', []);
app.controller('SideNavCtrl', function($scope, $http, $state, $stateParams) {

		$scope.list = [{
			parent: {
				title: '主页',
				url: '/home'
			},{
				parent: {
					title: '商品管理',
					url: 'javascript:;',
					child: [{
						title: '单一商品',
						url: ''
					},{
						title: '组合商品',
						url: ''
					}]					
				}
			},{
				parent: {
					title: '店铺管理',
					url: '',
					child: [{
						title: '在售商品',
						url: ''
					},{
						title: '商品陈列',
						url: ''
					}]					
				}
			},{
				parent: {
					title: '订单管理',
					url: '',
					child: [{
						title: '订单输入',
						url: ''
					},{
						title: '订单查询',
						url: ''
					}，{
						title: '订单审核',
						url: ''
					},{
						title: '退货处理',
						url: ''
					}]					
				}
			},{
				parent: {
					title: '仓库管理',
					url: '',
					child: [{
						title: '货位管理',
						url: ''
					},{
						title: '库存管理',
						url: ''
					}]					
				}
			},{
				parent: {
					title: '配送管理',
					url: '',
					child: [{
						title: '配载管理',
						url: ''
					},{
						title: '车辆管理',
						url: ''
					}]					
				}
			},{
				parent: {
					title: '统计分析',
					url: '',
					child: [{
						title: '订单统计',
						url: ''
					}]					
				}
			},{
				parent: {
					title: '用户管理',
					url: '',
					child: [{
						title: '单一商品',
						url: ''
					},{
						title: '组合商品',
						url: ''
					}]					
				}
			}
		}];		
		$scope.isActive = false;
		$scope.listToggle = function(){
			$scope.isActive = !$scope.isActive;
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