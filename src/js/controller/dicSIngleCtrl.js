app.controller('DicSingleCtrl', function($scope,http){

	$scope.detailState = false;
	$scope.toggleDetailState = function(bool) {
		
		$scope.detailState = bool;
	}
})