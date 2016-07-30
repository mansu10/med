app.controller('LoginCtrl', function($scope, http, $state) {

		$scope.loginInfo = {
			name: '',
			password: ''
		}


		$scope.login = function() {
			
			console.log("login info:" + JSON.stringify($scope.loginInfo));
			
			if (!$scope.loginInfo.name) {
				alert("请输入用户名");
				return;
			} 
			if (!$scope.loginInfo.password) {
				alert("请输入密码");
				return;
			} 
			
			http.post($scope.loginInfo,URL.login).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					if (respone.flag) {
						$state.go('home.dashboard');
					} else{
						alert("密码或用户名有误，请重新输入！！");
					}
					
				},
				function(respone) {
					console.log("login failed!" + JSON.stringify(respone));
					alert(respone);
				});
		}
	})