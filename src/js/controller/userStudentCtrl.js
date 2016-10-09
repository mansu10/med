app.controller('UserStudentCtrl', function($scope,http){
    var id = 0;
    $scope.user = {
			    	'userCode':'测试用户',
				    'userName':'测试',
				    'userType':'学员',
				    'userPassword':'123322',
				    'studentId':'20131202',
				    'className':'药理2班',
				    'startTime':'2016-08-01',
				    'endTime':'2016-11-01'
				};
				
	$scope.userPassword = '';
				
	$scope.updateUser = function(){
		
		if($scope.userPassword != $scope.user.userPassword){
			alert("两次密码输入不一致！")
			return;
		}
		http.post({
				'method':'updateUser',
				'user':JSON.stringify({
					'id':id,
					'userPassword':$scope.userPassword
				})
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========密码修改成功！========="+JSON.stringify(respone));
					alert("密码修改成功！！")
				},
				function(respone) {
					console.log("updateUser failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
				
})