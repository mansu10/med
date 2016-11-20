app.controller('HeaderCtrl', function($rootScope, $scope,$localstorage, instruct){
	$rootScope.collapse = false;
	$scope.toggle = function(){
		$rootScope.collapse = !$rootScope.collapse;
	}
	
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

})