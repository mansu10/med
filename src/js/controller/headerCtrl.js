app.controller('HeaderCtrl', function($rootScope, $state, $scope,$localstorage, instruct){
	$rootScope.collapse = false;
	$scope.toggle = function(){
		$rootScope.collapse = !$rootScope.collapse;
	}
	var agency = $localstorage.getObject('agency');
	$scope.roleName = $rootScope.user.roleName;
	$scope.sAgency = $rootScope.user.sAgency;
	$scope.sAgencyType = $rootScope.user.sAgencyType;

	$scope.titleName = '机构名称：' + agency.sAgencyType + '-岗位角色：' + agency.roleName;
	var user1 = $localstorage.getObject("user");
	$scope.username = user1.userName;
	// console.log("USER2==="+JSON.stringify(user1)+"-----"+$scope.username)

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