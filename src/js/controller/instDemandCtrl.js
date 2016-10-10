app.controller('InstDemandCtrl', function($scope,http){
	
	$scope.detailState = false;

	$scope.toggleDetailState = function(bool) {
		
		$scope.detailState = bool;
	}

	$scope.editMode = true;

	$scope.toggleEditMode = function(bool) {
		$scope.editMode = bool;
	}
	
	$scope.type = [
		'师救护所',
		'团救护所',
		'营救护所',
		'野战医疗所',
		'野战医疗队',
		'野战医院',
		'基地医院'
	],
	
	$scope.selectedName = '师救护所';

})