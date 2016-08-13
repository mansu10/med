app.controller('DistrLoadCtrl', function($scope,http){

	/**
	 * 切换车辆
	 * 
	 */
	$scope.currentIndex = 0;
	$scope.carDetail = {
		'id': '车辆ID',
		'carCode': '车辆编号',
		'carVolume': '车辆容积',
		'maxWeight': '最大载重'
	};
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
		}else if(param>0 && $scope.currentIndex != cars.length-1){
			$scope.currentIndex++;
			$scope.carDetail = cars[$scope.currentIndex];
		}
	}
	function clone(t, obj){
		var cp = {};
		for(var o in t){
			cp[o] = obj[o];
		}
		return cp;
	} 
	function construct(list){
		var t = {
			'id': '',
			'carCode': '',
			'carVolume': '',
			'maxWeight': ''
		};
		for (var i = 0; i < list.cars.length; i++) {
			var item = clone(t, list.cars[i]);
			item.orders = [];
			$scope.transportList.push(item);
			console.log($scope.transportList);
		}
	}
	$scope.transportList = [];

	// 获取ajax数据存放对象
	$scope.vehicleList = {};
	http.post({'method':'queryAllCars','numberOrType':''},URL.carQurey).then(
			function(respone) {
				// console.log(JSON.stringify(respone));
				$scope.vehicleList = respone;
				$scope.carDetail = $scope.vehicleList.cars[0]; 

				construct($scope.vehicleList);
			},
			function(respone) {
				console.log("Order qurey failed!" + JSON.stringify(respone));
				alert(respone);
		});
})