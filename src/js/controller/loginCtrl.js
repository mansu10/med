app.controller('LoginCtrl', function($scope, http, $state) {

		$scope.loginInfo = {
			user: '',
			pwd: ''
		}


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
			
			http.post($scope.loginInfo,URL.login).then(
				function(respone) {
					console.log(JSON.stringify(respone));
					if (respone.flag) {
						$state.go('home');
					} else{
						alert("login failed!!");
					}
					
				},
				function(respone) {
					console.log("login failed!" + JSON.stringify(respone));
					alert("login failed!!");
				});
		}
	})