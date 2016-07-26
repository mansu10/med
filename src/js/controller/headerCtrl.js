app.controller('HeaderCtrl', function($rootScope, $scope){
		$rootScope.collapse = false;
		$scope.toggle = function(){
			$rootScope.collapse = !$rootScope.collapse;
		}
	})