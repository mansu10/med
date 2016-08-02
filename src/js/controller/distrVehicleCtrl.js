app.controller('DistrVehicleCtrl', function($scope,http){
	// 浮层控制
	$scope.modalToggle = function(bool){
		$scope.modalState = bool;
	}
	// 需ajax请求订单列表
	$scope.vehicleList = {
		    "code": 0,
		    "vehicle": [{
	            "carCode": '车辆编号',
	            "carNumber": "车牌号",
	            "carName": "车名",
	            "carType": "车型",
	            "carUnit": "所属单位",
	            "carSize": "尺寸",
	            "carLoad": "载重",
	            "capacity": "容积",
	            "driver": "司机",
	            "status": "状态",
	            "memo": "备注"
	        },{
	            "carCode": 'C0001',
	            "carNumber": "沪C0001",
	            "carName": "1号车",
	            "carType": "车型",
	            "carUnit": "第1车队",
	            "carSize": "5000",
	            "carLoad": "50",
	            "capacity": "5000",
	            "driver": "王二",
	            "status": "运输中",
	            "memo": "备注"
	        }]
		}
	// 详细信息model
	$scope.detail = {};
	$scope.showDetail = function(index,item){
		$scope.modalToggle(true);
		$scope.detail.item = item;
		$scope.detail.index = index;
	};
	$scope.saveChange = function(){
		var index = $scope.detail.index;
		var vehicle = $scope.vehicleList.vehicle[index];
		// for (var o in $scope.detail.item) {
		// 	vehicle[o] =  $scope.detail.item[o];
		// }

		// vehicle = $scope.detail.item;
		$scope.modalToggle(false);
	}
	/************ 添加新明细 start ***************/
	// 新增明细存储model
	$scope.newItem = {};
	$scope.addItem = function(newItem){
		$scope.vehicleList.vehicle.push({
			"carCode": newItem.carCode,
			"carNumber": newItem.carNumber,
			"carName": newItem.carName,
			"carType": newItem.carType,
			"carUnit": newItem.carUnit,
			"carSize": newItem.carSize,
			"carLoad": newItem.carLoad,
			"capacity": newItem.capacity,
			"driver": newItem.driver,
			"memo": newItem.memo
		})
	};
	// 删除明细
	$scope.rmItem = function(index){
		$scope.vehicleList.vehicle.splice(index,1);
	};
	// 显示明细
	$scope.iptState = false;
	$scope.iptToggle = function(bool){
		$scope.iptState = bool;
	};
	// 清空明细输入框
	$scope.iptReset = function(newItem){
		$scope.newItem = {};
	};
	// 保存
	$scope.iptSave = function(newItem){
		$scope.addItem(newItem);
		$scope.iptToggle(false);
		$scope.iptReset(newItem);
	};
	/************* 添加明细 end ***************/		
})