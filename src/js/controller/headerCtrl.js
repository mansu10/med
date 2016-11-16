app.controller('HeaderCtrl', function($rootScope, $scope,$localstorage, instruct){
	$rootScope.collapse = false;
	$scope.toggle = function(){
		$rootScope.collapse = !$rootScope.collapse;
	}
	
	var user1 = $localstorage.getObject("user");
	$scope.username = user1.userName;
	// console.log("USER2==="+JSON.stringify(user1)+"-----"+$scope.username)

	$scope.userInfo = false;
	$scope.toggleUserInfo = function($event){
		$scope.userInfo = !$scope.userInfo;

		$event.stopPropagation();
	}

	$scope.$on('defaultState', function () {

		console.log($scope.userInfo);
	})
	$scope.itemList = instruct.get();
	$scope.$on('instructChange', function(){
		$scope.itemList = instruct.get();
	})
	
	$scope.isInstruct = false;
	$scope.toggleInstruct = function(){
		$scope.isInstruct = !$scope.isInstruct;
	}

})