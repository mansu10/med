app.controller('TransDispatchCtrl', function($scope,http,$filter){

    $scope.alerts = [
        // { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        // { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.setAlertClose = function(obj){
    	$scope.alerts.push(obj);
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
				$scope.changeState('detail');
			}, 
			function(res){
				alert(JSON.stringify(res));
			})


	}
	/**
	 * 选择单号查看明细
	 * @param  {[type]} code [description]
	 * @return {[type]}      [description]
	 */
	$scope.queryStowageList = function(code){
		var obj = {
			"method": "findStowageByCode",
			"stowageCode":code
		}
		http.post(obj, URL.StowageServlet).then(
			function(res){
				if (res.code === 0) {
					var result = res.stowage;
					angular.forEach(result.stowageItems, function(item,index,array){
						item.invoiceTime = $filter('date')(item.invoiceTime, 'yyyy-MM-dd HH:mm:ss');
						item.signedTime = $filter('date')(item.signedTime, 'yyyy-MM-dd HH:mm:ss');
					})
					$scope.stowageList = angular.copy(result)
				}else{
					alert("数据返回错误");
				}
				
			}, 
			function(res){
				alert(JSON.stringify(res));
			})
	}
	/**
	 * 更新单号时间信息 TODO
	 * @return {[type]} [description]
	 */
	$scope.updateStowageItems = function(){
		angular.forEach($scope.stowageList.stowageItems, function(item,index,array){
			item.stowageCode = $scope.stowageCode;
		})

		var obj = {
			'method':'updateStowageItems',
			'stowageItems': JSON.stringify($scope.stowageList.stowageItems) 
		}
		console.log(JSON.stringify($scope.stowageList.stowageItems))
		http.post(obj, URL.StowageServlet).then(
			function(res){
				if (res.code === 0) {
					alert("保存成功")
				}else{
					alert("数据返回错误");
				}
				
			}, 
			function(res){
				alert(JSON.stringify(res));
			})
	}
	/**
	 * 调度页
	 * @param  {[type]} carCode [description]
	 * @return {[type]}         [description]
	 */
	
	// 当前选中的车辆编号
	$scope.currentCar = '';
	// 司机临时列表
	$scope.operatorList = [];
	$scope.queryDispatchDetail = function(carCode){
		$scope.getOperator();
		$scope.changeState('dispatch');
		$scope.currentCar = carCode;
		$scope.queryDispatchPlan(carCode, '休整完毕');

	}

	/**
	 * 获取司机信息
	 * @return {[type]} [description]
	 */
	$scope.getOperator = function(){
		var obj = {
			'method':'findOperatorByPosition',
			'position':'驾驶员'
		}
		http.post(obj, URL.OperatorServlet).then(
			function(res){
				$scope.operatorList = res.operators;
				console.log(JSON.stringify(res.operators))
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}

	/**
	 * 更新车辆状态信息
	 * @param  {[type]} carCode [description]
	 * @param  {[type]} status  [description]
	 * @return {[type]}         [description]
	 */
	$scope.updateCarStatus = function(carCode, status){
		var obj = {
			"method": "updateCarStatusByCode",
			"carCode": carCode,
			"carStatus": status
		}
		http.post(obj, URL.CarServlet).then(
			function(res){
				alert("状态更新成功");
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
	/**
	 * 发送文本指令
	 * @type {String}
	 */
	$scope.dispatchDirect = '';
	$scope.updateDirectives = function(){

		var obj = {
			"method": "updateInstructionByCode",
			"instruction": $scope.dispatchDirect,
			"carCode": $scope.currentCar
		}
		http.post(obj, URL.CarServlet).then(
			function(res){
				if (res.code === 0) {
					alert("指令发送成功");
				}else{
					alert("数据返回错误，请再次尝试");
				}
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
	/**
	 * 修改发车计划
	 * @return {[type]} [description]
	 */
	$scope.queryDispatchPlan = function(carCode, status){
		var obj = {
			"method": "findStowageCodesByCarCode",
			"carCode": carCode,
			"carStatus": status	
		}
		http.post(obj, URL.CarServlet).then(
			function(res){
				$scope.dispatchOrders = res.stowageCode;
				console.log("666666666"+JSON.stringify($scope.dispatchOrders))
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}
	$scope.dispatchOrdersDetail = {};
	$scope.dispatchOrdersItems = '';
	$scope.queryDispatchPlanDetail = function(code){
		var obj = {
			"method": "findStowageByCode",
			"stowageCode":code
		}
		http.post(obj, URL.StowageServlet).then(
			function(res){
				if (res.code === 0) {
					$scope.dispatchOrdersDetail = res.stowage;
					console.log(JSON.stringify(res.stowage))
					var items = [];
					angular.forEach($scope.dispatchOrdersDetail.stowageItems, function(item,index,array){
						items.push(item.receiptAddress);
					})
					$scope.dispatchOrdersItems = items.join(',');
				}else{
					alert("数据返回错误");
				}
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)

	}
	$scope.updateDispatchPlan = function(){
		var obj = JSON.stringify({
				"stowageCode":$scope.selectedOg,
				"operator":$scope.selectedOperator.operatorName,
				"loadTime":$scope.dispatchOrdersDetail.loadTime,
				"departureTime":$scope.dispatchOrdersDetail.departureTime
			});
		var data = {
			"method": "updateStowage",
			"stowage": obj + ''
		}
		http.post(data, URL.StowageServlet).then(
			function(res){
				if (res.code === 0) {
					alert("保存成功")
				}else{
					alert("保存出错："+ res)
				}
			},
			function(res){
				alert(JSON.stringify(res));
			}
		)
	}

})