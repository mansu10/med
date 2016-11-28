app.controller('LoginCtrl', function($scope, http, $state,$localstorage) {

		$scope.loginInfo = {
			name: '',
			password: ''
		}


		$scope.login = function() {
			
			console.log("login info:" + JSON.stringify($scope.loginInfo));
			
			if (!$scope.loginInfo.name) {
				popAlert("请输入用户名");
				return;
			} 
			if (!$scope.loginInfo.password) {
				popAlert("请输入密码");
				return;
			} 
			
			http.post($scope.loginInfo,URL.login).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					if (respone.flag) {
						var user = {
							"userCode":respone.userCode,
							"userName":respone.userName,
							"role":respone.role
						};
						console.log("USER==="+JSON.stringify(user))
						$localstorage.setObject("user",user);
						var user1 = $localstorage.getObject("user");
						console.log("USER1==="+JSON.stringify(user1))
						$state.go('home.dashboard');
					} else{
						popAlert("密码或用户名有误，请重新输入！！");
					}
					
				},
				function(respone) {
					console.log("login failed!" + JSON.stringify(respone));
					popAlert(respone);
				});
		}
	})