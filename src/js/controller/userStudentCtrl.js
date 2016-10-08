app.controller('UserStudentCtrl', function($scope,http){
    
    $scope.user = {
//			    	'userCode':'20131202',
//				    'userName':'刘备2',
//				    'userType':1,
//				    'userPassword':'123322',
//				    'studentId':'20131202',
//				    'className':'班次',
//				    'startTime':'2016-08-01',
//				    'endTime':'2016-11-01'
				};
				
	$scope.userPassword = '';
				
	$scope.save = function(){
		
		if($scope.userPassword != $scope.user.userPassword){
			alert("两次密码输入不一致！")
			return;
		}
		http.post({
				'method':'addUser',
				'user':JSON.stringify($scope.user)
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========已保存========="+JSON.stringify(respone));
					alert("已保存！")
				},
				function(respone) {
					console.log("addUser failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
	}
	
//	$scope.resetPassword = function(){
	
		http.post({
				'method':'queryUser',
				'userCode':'',
				'userName':'',
				'userType':'',
				'className':''
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========queryUser========="+JSON.stringify(respone));
				},
				function(respone) {
					console.log("queryUser failed!" + JSON.stringify(respone));
					alert(JSON.stringify(respone));
		});
//	}
				
})