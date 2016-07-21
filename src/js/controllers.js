//var SideNavModule = angular.module('SideNavModule', []);
app.controller('SideNavCtrl', function($scope, $http, $state, $stateParams) {
		$scope.greeting = {
			text: 'hello'
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