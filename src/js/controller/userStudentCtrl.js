app.controller('UserStudentCtrl', function($rootScope, $scope,http){
    var id = 0;
    // $scope.user = {
			 //    	'userCode':'测试用户',
				//     'userName':'测试',
				//     'userType':'学员',
				//     'userPassword':'123322',
				//     'studentId':'20131202',
				//     'className':'药理2班',
				//     'startTime':'2016-08-01',
				//     'endTime':'2016-11-01'
				// };
	$scope.user = $rootScope.user;
	$scope.userPassword = '';
				
	$scope.updateUser = function(){
		
		if($scope.userPassword != $scope.user.userPassword){
			popAlert("两次密码输入不一致！")
			return;
		}
		http.post({
				'method':'updateUser',
				'user':JSON.stringify({
					'id':$scope.user.id,
					'userPassword':$scope.userPassword
				})
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========密码修改成功！========="+JSON.stringify(respone));
					popAlert("密码修改成功！！")
				},
				function(respone) {
					console.log("updateUser failed!" + JSON.stringify(respone));
					popAlert(JSON.stringify(respone));
		});
	}
				
})