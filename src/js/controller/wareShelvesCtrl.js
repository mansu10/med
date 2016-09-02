app.controller('WareShelvesCtrl', function($scope,http){

	$scope.items = [
			1,2,3,4,5,6,7,8
		];

	/**
	 * [stateBox 用于切换收货明细显示状态]
	 * 3种
	 * @type {Array}
	 */
	$scope.stateBox = [false, false, false];
	$scope.toggleState = function(index, event){
		var e = event;
		e.stopPropagation();
		for (var i = 0; i < $scope.stateBox.length; i++) {
			$scope.stateBox[i] = false;
		}
		$scope.stateBox[index] = true;
	}

})