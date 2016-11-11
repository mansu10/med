app.controller('TransVehicleCtrl', function($scope,http){
	
	$scope.stateFactory = {
		"query": true,
		"detail": false,
		"perform": false
	}
	
	var method;
	/**
	 * 切换页面状态
	 * @param  {[type]} option [description]
	 * @return {[type]}        [description]
	 */
	$scope.changeState = function(option,item){
	
		for(o in $scope.stateFactory){
			$scope.stateFactory[o] = false;
		}
		$scope.stateFactory[option] = true;
		
		if('detail' == option){
			if(isEmptyValue(item)){
				method = 'addCar';
			}else{
				method = 'updateCar';
			}
			$scope.car = item;
		}
	}
	
	//查询车辆
	$scope.queryAllCars = function(){
			http.post({
					'method': 'queryAllCars',
					'numberOrCode':$scope.carNumber,
					'agencyCode':'B0004'
				}, URL.CarServlet).then(
					function(respone) {
						alert("车辆查询成功");
						$scope.cars = respone.cars;
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	
	//添加车辆
	$scope.updateCar = function(){
			http.post({
					'method': method,//'addCar','updateCar'
					'car':JSON.stringify($scope.car)
				}, URL.CarServlet).then(
					function(respone) {
						alert(method+" success!");
						$scope.changeState('query');
						if(method == 'addCar'){
							$scope.cars.push(angular.copy($scope.car));
						}
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	
	//添加车辆
	$scope.deleteCar = function(id,index){
			http.post({
					'method': 'deleteCar',//'addCar','updateCar'
					'ids':id
				}, URL.CarServlet).then(
					function(respone) {
						alert("删除成功！");
						$scope.cars.splice(index, 1);
					},
					function(respone) {
						alert(JSON.stringify(respone));
					});
	}
	
})