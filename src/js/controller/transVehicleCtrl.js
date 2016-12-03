app.controller('TransVehicleCtrl', function($rootScope, $scope,http){
	
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
		}if('perform' == option){
			$scope.carRecords = item.carRecords;
		}
	}
	
	//查询车辆
	$scope.queryAllCars = function(){
			http.post({
					'method': 'queryAllCars',
					'numberOrCode':$scope.carNumber,
		            'agencyCode':$rootScope.user.agencyCode
				}, URL.CarServlet).then(
					function(respone) {
						popAlert("车辆查询成功");
						$scope.cars = respone.cars;
					},
					function(respone) {
						popAlert(JSON.stringify(respone));
					});
	}
	
	//添加车辆
	$scope.updateCar = function(){
		if(method == 'updateCar' && isEmptyValue($scope.car.id)){
			popAlert("更新车辆的id不能为空！");
			return;
		}
			http.post({
					'method': method,//'addCar','updateCar'
					'car':JSON.stringify($scope.car),
			        'agencyCode':$rootScope.user.agencyCode
				}, URL.CarServlet).then(
					function(respone) {
						popAlert(method+" success!");
						$scope.changeState('query');
						if(method == 'addCar'){
							$scope.car.id = respone.id;
							if (isEmptyValue($scope.cars)) {
								$scope.cars = [];
							} 
							$scope.cars.push(angular.copy($scope.car));
							console.log($scope.cars);
						}
					},
					function(respone) {
						console.log(respone);
						popAlert(JSON.stringify(respone));
					});
	}
	
	//删除车辆
	$scope.deleteCar = function(id,index){
		if(isEmptyValue(id)){
			popAlert("被删除项id不能为空！");
			return;
		}
			http.post({
					'method': 'deleteCar',//'addCar','updateCar'
					'ids':id
				}, URL.CarServlet).then(
					function(respone) {
						popAlert("删除成功！");
						$scope.cars.splice(index, 1);
					},
					function(respone) {
						popAlert(JSON.stringify(respone));
					});
	}
	
})