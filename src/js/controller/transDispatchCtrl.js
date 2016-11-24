app.controller('TransDispatchCtrl', function($scope,http){

    $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    function setAlertClose(){
    	var timer = setTimeout(function(){
    		$scope.closeAlert(-1);
    	},5000)
    }

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
	$scope.carStatusList = [{
		'state':'休整中',
		'color':'btn-info'
	},{
		'state':'休整完毕',
		'color':'btn-info'
	},{
		'state':'待命中',
		'color':'btn-success'
	},{
		'state':'装载中',
		'color':'btn-warning'
	},{
		'state':'装载完毕',
		'color':'btn-warning'
	},{
		'state':'发车中',
		'color':'btn-danger'
	},{
		'state':'发车完毕',
		'color':'btn-danger'
	},{
		'state':'前运中',
		'color':'btn-default'
	},{
		'state':'回程中',
		'color':'btn-primary'
	},{
		'state':'回程完毕',
		'color':'btn-primary'
	}]
	$scope.updateCarStatus = function(carCode, status){
		var obj = {
			"method": "updateCarStatusByCode",
			"carCode": carCode,
			"carStatus": status
		}
		http.post(obj, URL.CarServlet).then(
			function(res){

			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
	$scope.updateDirectives = function(directive, carCode){
		var obj = {
			"method": "updateInstructionByCode",
			"instruction": directive,
			"carCode": carCode
		}
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
		var obj = {
			"method": "updateStowage",
			"stowage": {
				
			}
		}
		http.post(data, URL.CarServlet).then(
			function(res){

			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
})