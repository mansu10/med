app.controller('UserTeacherCtrl', function($rootScope, $scope,http){
	$scope.userType = $rootScope.user.userType;
    $scope.users = [];
    var temp = [];
    $scope.queryInfo = {
			'userCode':'',
			'userName':'',
			'userType':'',
			'className':''
    }
    
    $scope.queryUser = function(){
    	console.log(JSON.stringify($rootScope.user.agencyCode));
		http.post({
				'method':'queryUser',
				'userCode':$scope.queryInfo.userCode,
				'userName':$scope.queryInfo.userName,
				'userType':$scope.queryInfo.userType,
				'className':$scope.queryInfo.className,
	            'agencyCode':$rootScope.user.agencyCode
			},URL.UserServlet).then(
				function(respone) {
					$scope.users = respone.order;	
					// popAlert('queryUser success!')
				},
				function(respone) {
					console.log("queryUser failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
    
    $scope.newAccount = {
//			    	'userCode':'',
//				    'userName':'',
//				    'userType':'1',
//				    'userPassword':'',
//				    'studentId':'',
//				    'className':'',
//				    'startTime':'',
//				    'endTime':'',
//				    'team':''
	};
	$scope.isCreateAccount = false;
	$scope.editable = false;
	$scope.label = '修改';
	$scope.createAccount = function(){
		$scope.isCreateAccount = true;
		temp = angular.copy($scope.users);
		$scope.users = [];
	}
	
	$scope.save = function(){
		if(isEmptyValue($scope.newAccount)){
			return;
		}
		console.log(JSON.stringify($scope.newAccount));
		$scope.newAccount.agencyCode = $rootScope.user.agencyCode;
		http.post({
				'method':'addUser',
				'user':getUserInfoStr($scope.newAccount)
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========已保存========="+JSON.stringify(respone));
					popAlert("已保存！");
					$scope.isCreateAccount = false;
//					$scope.users.push(angular.copy($scope.newAccount));
					$scope.newAccount = {};
					$scope.queryInfo = {
						'userCode':'',
						'userName':'',
						'userType':'',
						'className':''
   					 }
					$scope.queryUser();
					
				},
				function(respone) {
					console.log("addUser failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});	
		
	}
	
	$scope.cancel = function(){
		$scope.isCreateAccount = false;
		$scope.newAccount = {};
		$scope.users = temp;
	}
	
	$scope.edit = function(index){
		if($scope.users[index].editable){
			$scope.label = '修改';
			updateUser($scope.users[index]);
			$scope.users[index].editable = !$scope.users[index].editable;
			return;
		}
		$scope.label = '保存';
		$scope.users[index].editable = !$scope.users[index].editable;
	}
	
	$scope.del = function(index){
		http.post({
				'method':'deleteUser',
				'id':$scope.users[index].id
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========已删除========="+JSON.stringify(respone));
					if (respone.code == 0) {
						popAlert("删除成功");
					}else{
						popAlert("操作失败："+JSON.stringify(respone));
					}
					
				},
				function(respone) {
					console.log("deleteUser failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
		
		$scope.users.splice(index,1);
		
	}
	
	$scope.resetPassword = function(index){
		$scope.users[index].userPassword = '123456';
		http.post({
				'method':'resetPassword',
				'id':$scope.users[index].id
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========密码已重置========="+JSON.stringify(respone));
					popAlert('操作成功！')
				},
				function(respone) {
					console.log("resetPassword failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	
   var updateUser = function(item){
		http.post({
				'method':'updateUser',
				'user':getUserInfoStr(item)
			},URL.UserServlet).then(
				function(respone) {
					console.log("=========updateUser========="+JSON.stringify(respone));
					popAlert('操作成功！')
				},
				function(respone) {
					console.log("updateUser failed!" + JSON.stringify(respone));
					popAlert("操作失败："+JSON.stringify(respone));
		});
	}
	
	var getUserInfoStr = function(obj){
		var temp = angular.copy(obj);
		if (temp.userType == '学员') {
			temp.userType = 1;
		} else{
			temp.userType = 2;
		} 
		
		return JSON.stringify(temp);
	}
	
	
	
})