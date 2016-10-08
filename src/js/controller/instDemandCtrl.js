app.controller('InstDemandCtrl', function($scope,http){
	
	$scope.detailState = false;

	$scope.toggleDetailState = function(bool) {
		
		$scope.detailState = bool;
	}

	$scope.editMode = true;

	$scope.toggleEditMode = function(bool) {
		$scope.editMode = bool;
	}

})