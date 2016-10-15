app.controller('HeaderCtrl', function($rootScope, $scope,$localstorage){
		$rootScope.collapse = false;
		$scope.toggle = function(){
			$rootScope.collapse = !$rootScope.collapse;
		}
		
		var user1 = $localstorage.getObject("user");
		$scope.username = user1.userName;
		// console.log("USER2==="+JSON.stringify(user1)+"-----"+$scope.username)
	})