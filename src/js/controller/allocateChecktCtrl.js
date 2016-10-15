app.controller('AllocateCheckCtrl', function($scope,http){

	$scope.stateFactory = {
		"query": true,
		"print": false,
		"record": false
	}
	/**
	 * 切换页面状态
	 * @param  {[type]} option [description]
	 * @return {[type]}        [description]
	 */
	$scope.changeState = function(option){
	
		for(o in $scope.stateFactory){
			$scope.stateFactory[o] = false;
		}
		$scope.stateFactory[option] = true;
	}
})