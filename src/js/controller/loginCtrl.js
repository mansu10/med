app.controller('LoginCtrl', function($scope, $rootScope, http, $state, $localstorage) {



		$scope.loginInfo = {
			name: '',
			password: ''
		}
		$scope.doLogin = function(e){
			if (e.keyCode == 13) {
				$scope.login();
			}
		}
		$scope.login = function() {
			
			// console.log("login info:" + JSON.stringify($scope.loginInfo));
			
			if (!$scope.loginInfo.name) {
				popAlert("请输入用户名");
				return;
			} 
			if (!$scope.loginInfo.password) {
				popAlert("请输入密码");
				return;
			} 
			// if ($scope.rmbme) {
			// 	$localstorage.setObject('loginInfo',loginInfo);

			// }
			http.post($scope.loginInfo,URL.login).then(
				function(respone) {
					// console.log(JSON.stringify(respone));
					if (respone.flag) {
						var user = {
							"id":respone.userId,
							"userCode":respone.userCode,
							"userName":respone.userName,
							"role":respone.role,
							"token": respone.token,
							"loginTime": respone.loginTime,
							"agencyCode": respone.agencyCode,
							"className": respone.className,
							"studentId": respone.studentId,
							"startTime": respone.startTime.time,
							"endTime": respone.endTime.time,
							"studentId": respone.studentId,
							"userType": respone.userType
						};
						// console.log("USER==="+JSON.stringify(user))
						$localstorage.setObject("user",user);
						$rootScope.user = user;
						var user1 = $localstorage.getObject("user");
						// console.log("USER1==="+JSON.stringify(user1))
						$state.go('mode');
					} else{
						popAlert("密码或用户名有误，请重新输入！！");
					}
					
				},
				function(respone) {
					// console.log("login failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
				});
		}
	})