app.controller('TransDispatchCtrl', function($scope,http){
	$scope.stateFactory = {
		"query": true,
		"detail": false,
		"dispatch": false
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

	//车辆调度查询
	$scope.queryAllCarsWithCode = function(){
			http.post({
					'method': 'queryAllCarsWithCode',
					'agencyCode':'B0004'
				}, URL.CarServlet).then(
					function(respone) {
						// alert("查询线路分配");
						$scope.cars = respone.carStatus;
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	$scope.queryAllCarsWithCode();
})