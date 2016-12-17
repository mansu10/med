app.controller('HeaderCtrl', function($rootScope, $state, $scope,$localstorage, instruct){
	$rootScope.collapse = false;
	$scope.toggle = function(){
		$rootScope.collapse = !$rootScope.collapse;
	}
	var agency = $localstorage.getObject('agency');
	// $scope.roleName = !!$rootScope.user.roleName ? $rootScope.user.roleName : '暂无';
	// $scope.sAgency = !!$rootScope.user.sAgency ? $rootScope.user.sAgency : '暂无';
	// $scope.sAgencyType = !!$rootScope.user.sAgencyType ? $rootScope.user.sAgencyType : '暂无';
	
	var sAgencyType = !!agency.sAgencyType ? agency.sAgencyType : '暂无';
	var sRoleName = !!agency.roleName ? agency.roleName : '暂无';


	var user1 = $localstorage.getObject("user");
	$scope.username = user1.userName;
	// console.log("USER2==="+JSON.stringify(user1)+"-----"+$scope.username)
	if (user1.userType == 0) {
		$scope.titleName = '管理员';
	}else{
		$scope.titleName = '机构名称：' + sAgencyType + '-岗位角色：' +  sRoleName;
	}

	$scope.userInfo = false;
	$scope.toggleUserInfo = function(){
		$scope.userInfo = !$scope.userInfo;

	}

	$scope.itemList = instruct.get();
	// $scope.itemLists = ['llll'];
	
	$scope.$on('instructChange', function(){
		$scope.itemList = instruct.get();
		// $scope.itemLists = ['kkk'];
	})
	
	$scope.isInstruct = false;
	$scope.toggleInstruct = function(){
		$scope.isInstruct = !$scope.isInstruct;
	}

	$scope.logout = function(){
		$rootScope.user = {};
		$localstorage.clear("user");
		$state.go('login');
	}
})