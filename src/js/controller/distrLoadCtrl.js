app.controller('DistrLoadCtrl', function($scope,http){

	/**
	 * 切换车辆
	 * 
	 */
	$scope.currentIndex = 0;
	$scope.carDetail = {
		'carCode': '车辆编号',
		'carVolume': '车辆容积',
		'maxWeight': '最大载重'
	};
	$scope.vehicleList = {};
	/**
	 * [chgCar description]
	 * @param  {number} param 1:next -1:previous
	 * @return {null}
	 */
	$scope.chgCar = function(param){
		var cars = $scope.vehicleList.cars;
		if (param<0 && $scope.currentIndex != 0) {
			$scope.currentIndex--;
			$scope.carDetail = cars[$scope.currentIndex];
		}else if(param>0 && $scope.currentIndex != cars.length){
			$scope.currentIndex++;
			$scope.carDetail = cars[$scope.currentIndex];
		}
	}

	http.post({'method':'queryAllCars','numberOrType':''},URL.carQurey).then(
			function(respone) {
				// console.log(JSON.stringify(respone));
				$scope.vehicleList = respone;
				$scope.carDetail = $scope.vehicleList.cars[0];
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				alert(respone);
		});
})