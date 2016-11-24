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

	/**
	 * 查看详细运输、单号
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	$scope.queryTrancarDetail = function(carCode, status){
		var data = {
			"method": "findStowageCodesByCarCode",
			"carCode": carCode,
			"carStatus": status
		}
		http.post(data, URL.CarServlet).then(
			function(res){
				
				$scope.stowageCodeList = res.stowageCode;
				console.log($scope.stowageCodeList)
				$scope.changeState('detail');
			}, 
			function(res){
				alert(JSON.stringify(res));
			})


	}

	$scope.queryStowageList = function(code){
		var data = {
			"method": "findStowageByCode",
			"stowageCode":code
		}
		// console.log(code);
		http.post(data, URL.StowageServlet).then(
			function(res){
				
				$scope.stowageList = res.stowage;
				console.log('22222222--'+JSON.stringify($scope.stowageList)+'--------')
			}, 
			function(res){
				alert(JSON.stringify(res));
			})
	}
	$scope.updateStowageItems = function(){
		$scope.updateStowageList = {
			'method':'updateStowageItems',
			'stowageItems': $scope.stowageList

		}
	}
	$scope.updateCarStatus = function(data){
		data.method = 'updateCarStatusByCode'
		http.post(data, URL.CarServlet).then(
			function(res){

			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
	$scope.updateDirectives = function(){
		data.method = 'updateInstructionByCode'
		http.post(data, URL.CarServlet).then(
			function(res){

			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
	$scope.updateDispatchPlan = function(){

	}
})