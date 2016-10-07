app.controller('InstSupplyCtrl', function($scope,http){

	$scope.detailState = false;

	$scope.toggleDetailState = function(bool) {
		
		$scope.detailState = bool;
	}

})