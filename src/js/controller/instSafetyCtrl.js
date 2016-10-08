app.controller('InstSafetyCtrl', function($scope,http){

	$scope.addNewState = false;

	$scope.toggleAddNewState = function(bool) {
		
		$scope.addNewState = bool;
	}

})